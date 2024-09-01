from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user_model import User
from app.models.event_model import EventInvite

user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/user/search', methods=['GET'])
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


@user_bp.route('/user/friends', methods=['GET'])
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


@user_bp.route('/user/event-invites', methods=['GET'])
@jwt_required()
def get_event_invites():
    user_id = get_jwt_identity()

    invites = EventInvite.query.filter_by(user_id=user_id, status='pending').all()
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
