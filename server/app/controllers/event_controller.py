import logging
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo
from flask import Blueprint, request, jsonify
from flask_socketio import join_room, leave_room, emit
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import socketio
from app.models import db, Event, EventInvite, EventParticipant, User, Message


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


@event_bp.route('/event/<int:event_id>/update', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    try:
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)

        if not event or event.created_by != user_id:
            return jsonify({'error': 'Event not found or unauthorized'}), 404

        data = request.get_json()

        event.event_name = data.get('event_name', event.event_name)
        event.event_date = (
            datetime.fromisoformat(data.get('event_date').replace('Z', '+00:00'))
            if data.get('event_date')
            else event.event_date
        )
        event.meeting_time = data.get('meeting_time', event.meeting_time)
        event.meeting_place = data.get('meeting_place', event.meeting_place)
        event.description = data.get('description', event.description)

        db.session.commit()

        return jsonify({'message': 'Event updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating event: {str(e)}")
        return jsonify({'error': str(e)}), 500


@event_bp.route('/event/<int:event_id>/delete', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    try:
        user_id = get_jwt_identity()
        event = Event.query.get(event_id)

        if not event or event.created_by != user_id:
            return jsonify({'error': 'Event not found or unauthorized'}), 404

        EventParticipant.query.filter_by(event_id=event_id).delete()
        EventInvite.query.filter_by(event_id=event_id).delete()

        Message.query.filter_by(event_id=event_id).delete()

        db.session.delete(event)
        db.session.commit()

        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting event: {str(e)}")
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


@event_bp.route('/event/respond', methods=['POST'])
@jwt_required()
def respond_to_event():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        event_id = data.get('event_id')
        response = data.get('response')

        if response == 'accepted':
            existing_participant = EventParticipant.query.filter_by(
                event_id=event_id, user_id=user_id
            ).first()
            if not existing_participant:
                participant = EventParticipant(event_id=event_id, user_id=user_id)
                db.session.add(participant)

        invite = EventInvite.query.filter_by(event_id=event_id, user_id=user_id).first()
        if invite:
            invite.status = response

        db.session.commit()

        return jsonify({'message': 'Response recorded successfully.'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error responding to event: {str(e)}")
        return jsonify({'error': str(e)}), 500


@event_bp.route('/event/<int:event_id>/detail', methods=['GET'])
@jwt_required()
def get_event_detail(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404

        participants = (
            db.session.query(User)
            .join(EventParticipant, User.id == EventParticipant.user_id)
            .filter(EventParticipant.event_id == event_id)
            .all()
        )

        invited_friends = (
            db.session.query(User)
            .join(EventInvite, User.id == EventInvite.user_id)
            .filter(EventInvite.event_id == event_id, EventInvite.status == 'pending')
            .all()
        )

        messages = (
            Message.query.filter_by(event_id=event_id)
            .order_by(Message.timestamp.asc())
            .all()
        )
        message_list = [
            {
                'id': m.id,
                'user': m.user.username,
                'message': m.message,
                'timestamp': m.timestamp,
            }
            for m in messages
        ]

        participant_list = [{'id': p.id, 'username': p.username} for p in participants]
        invited_friends_list = [
            {'id': f.id, 'username': f.username} for f in invited_friends
        ]

        event_detail = {
            'event_name': event.event_name,
            'event_date': event.event_date.isoformat(),
            'meeting_time': event.meeting_time,
            'meeting_place': event.meeting_place,
            'description': event.description,
            'participants': participant_list,
            'invited_friends': invited_friends_list,
            'messages': message_list,
            'created_by': event.created_by,
        }

        return jsonify(event_detail), 200

    except Exception as e:
        logger.error(f"Error fetching event details: {str(e)}")
        return jsonify({'error': str(e)}), 500


@event_bp.route('/event/<int:event_id>/invite', methods=['POST'])
@jwt_required()
def invite_more_friends(event_id):
    try:
        data = request.get_json()
        invitee_ids = data.get('invitees', [])

        existing_invites = EventInvite.query.filter(
            EventInvite.event_id == event_id, EventInvite.user_id.in_(invitee_ids)
        ).all()

        already_invited_ids = {invite.user_id for invite in existing_invites}

        new_invitees = [
            invitee_id
            for invitee_id in invitee_ids
            if invitee_id not in already_invited_ids
        ]

        for invitee_id in new_invitees:
            invite = EventInvite(event_id=event_id, user_id=invitee_id)
            db.session.add(invite)

        db.session.commit()

        return jsonify({'message': 'Friends invited successfully.'}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error inviting friends: {str(e)}")
        return jsonify({'error': str(e)}), 500


@socketio.on('join_event_chat')
@jwt_required()
def handle_join_event_chat(data):
    user_id = get_jwt_identity()
    event_id = data.get('event_id')

    logger.info(f"User {user_id} is attempting to join chat for event {event_id}")

    participant = EventParticipant.query.filter_by(
        event_id=event_id, user_id=user_id
    ).first()

    if participant:
        logger.info(f"User {user_id} successfully joined the chat for event {event_id}")
        join_room(str(event_id))

        current_timestamp = datetime.now(ZoneInfo('UTC')).isoformat()

        emit(
            'receive_message',
            {
                'message': f'{participant.user.username}が参加。',
                'user': participant.user.username,
                'timestamp': current_timestamp,
            },
            room=str(event_id),
        )
        logger.info(f"Emitting join message for event {event_id} and user {user_id}")
    else:
        logger.warning(
            f"Unauthorized attempt to join chat for event {event_id} by user {user_id}"
        )
        emit('error', {'message': 'Unauthorized to join this chat'}, room=request.sid)


@socketio.on('send_message')
@jwt_required()
def handle_send_message(data):
    user_id = get_jwt_identity()
    event_id = data.get('event_id')
    message_text = data.get('message')

    logger.info(f"Received message from user {user_id}: {message_text}")

    participant = EventParticipant.query.filter_by(
        event_id=event_id, user_id=user_id
    ).first()

    if participant:
        message_id = str(uuid.uuid4())
        message = Message(
            id=message_id,
            event_id=event_id,
            user_id=user_id,
            message=message_text,
            timestamp=datetime.now(ZoneInfo('UTC')),
        )
        try:
            db.session.add(message)
            db.session.commit()
            logger.info(f"Message saved by user {user_id} to event {event_id}")
        except Exception as e:
            db.session.rollback()
            logger.error(f"Failed to save message: {str(e)}")
            emit('error', {'error': 'Failed to save message'}, to=request.sid)
            return

        current_timestamp = datetime.now(ZoneInfo('UTC')).isoformat()
        emit(
            'receive_message',
            {
                'id': message.id,
                'user': participant.user.username,
                'message': message.message,
                'timestamp': current_timestamp,
            },
            room=str(event_id),
            include_self=True,
        )
    else:
        logger.warning(
            f"Unauthorized attempt to send a message in event {event_id} by user {user_id}"
        )
        emit('error', {'error': 'Unauthorized to send message'}, to=request.sid)


@socketio.on('leave_room')
@jwt_required()
def handle_leave_room(data):
    user_id = get_jwt_identity()
    event_id = data.get('event_id')

    logger.info(f"User {user_id} is leaving chat for event {event_id}")

    leave_room(str(event_id))
    logger.info(f"User {user_id} has left the chat for event {event_id}")
    emit(
        'receive_message',
        {'message': f'{User.query.get(user_id).username} has left the chat.'},
        room=str(event_id),
    )
