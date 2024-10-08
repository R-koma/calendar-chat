from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user_model import User
from app.models.event_model import EventInvite, Event


@jwt_required()
def search_users():
    query = request.args.get('query', '')
    current_user_id = get_jwt_identity()

    if not query:
        return jsonify([])

    current_user = User.query.get(current_user_id)

    results = User.query.filter(User.username.ilike(f'%{query}%')).all()

    filtered_results = [
        user
        for user in results
        if user.id != current_user_id and user not in current_user.friends
    ]

    return jsonify(
        [{'id': user.id, 'username': user.username} for user in filtered_results]
    )


@jwt_required()
def get_friends():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({'message': 'User not found'}), 404

    friends = user.friends.all()
    friends_list = [
        {'id': friend.id, 'username': friend.username} for friend in friends
    ]

    return jsonify(friends_list), 200


@jwt_required()
def get_event_invites():
    user_id = get_jwt_identity()

    invites = (
        db.session.query(EventInvite)
        .join(Event, Event.id == EventInvite.event_id)
        .join(User, User.id == Event.created_by)
        .filter(EventInvite.user_id == user_id, EventInvite.status == 'pending')
        .all()
    )
    invites_list = [
        {
            'id': invite.event.id,
            'event_name': invite.event.event_name,
            'event_date': invite.event.event_date.isoformat(),
            'meeting_time': invite.event.meeting_time,
            'meeting_place': invite.event.meeting_place,
            'description': invite.event.description,
            'invited_by': invite.event.creator.username,
        }
        for invite in invites
    ]

    return jsonify(invites_list), 200
