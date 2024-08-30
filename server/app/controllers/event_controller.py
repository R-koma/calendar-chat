import logging

from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Event, EventInvite, EventParticipant

logger = logging.getLogger(__name__)

event_bp = Blueprint('event_bp', __name__)


@event_bp.route('/event/create', methods=['POST'])
@jwt_required()
def create_event():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

        event_date_str = data.get('event_date')
        event_date = (
            datetime.fromisoformat(event_date_str.replace('Z', '+00:00'))
            if event_date_str
            else None
        )

        event = Event(
            event_name=data.get('event_name'),
            event_date=event_date,
            meeting_time=data.get('meeting_time'),
            meeting_place=data.get('meeting_place'),
            description=data.get('description'),
            created_by=user_id,
        )
        db.session.add(event)
        db.session.commit()

        participant = EventParticipant(event_id=event.id, user_id=user_id)
        db.session.add(participant)

        invitee_ids = data.get('invitees', [])
        for invitee_id in invitee_ids:
            invite = EventInvite(event_id=event.id, user_id=invitee_id)
            db.session.add(invite)

        db.session.commit()

        return jsonify({'message': 'Event created successfully.'}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating event: {str(e)}")
        return jsonify({'error': str(e)}), 500


@event_bp.route('/event/user/participated-events', methods=['GET'])
@jwt_required()
def get_participated_events():
    user_id = get_jwt_identity()
    month = int(request.args.get('month', 1))
    year = int(request.args.get('year', datetime.now().year))

    logger.debug(
        f"Fetching events for user_id: {user_id}, month: {month}, year: {year}"
    )

    try:
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)

        logger.debug(f"Start date: {start_date}, End date: {end_date}")

        participated_events = (
            db.session.query(Event)
            .join(EventParticipant, Event.id == EventParticipant.event_id)
            .filter(
                (EventParticipant.user_id == user_id) | (Event.created_by == user_id)
            )
            .filter(Event.event_date >= start_date, Event.event_date < end_date)
            .all()
        )

        logger.debug(f"Found {len(participated_events)} events")

        events = [
            {
                'id': event.id,
                'event_name': event.event_name,
                'event_date': event.event_date.isoformat(),
            }
            for event in participated_events
        ]

        return jsonify(events), 200
    except Exception as e:
        logger.error(f"Error fetching participated events: {str(e)}")
        return jsonify({'error': str(e)}), 500
