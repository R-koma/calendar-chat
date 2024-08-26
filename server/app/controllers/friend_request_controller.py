from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, FriendRequest, User

friend_bp = Blueprint('friend_bp', __name__)


@friend_bp.route('/friend/request', methods=['POST'])
@jwt_required()
def send_friend_request():
    receiver_id = request.json.get('receiver_id')
    sender_id = get_jwt_identity()

    if receiver_id == sender_id:
        return jsonify({'msg': '自分自身にリクエストを送ることはできません。'}), 400

    existing_request = FriendRequest.query.filter_by(
        sender_id=sender_id, receiver_id=receiver_id
    ).first()

    if existing_request:
        return jsonify({'message': 'Friend request already sent.'}), 400

    friend_request = FriendRequest(sender_id=sender_id, receiver_id=receiver_id)
    db.session.add(friend_request)
    db.session.commit()

    return jsonify({'message': 'リクエストを送りました。'}), 201


@friend_bp.route('/friend/requests', methods=['GET'])
@jwt_required()
def get_friend_requests():
    user_id = get_jwt_identity()
    friend_requests = FriendRequest.query.filter_by(
        receiver_id=user_id, status='pending'
    ).all()
    return jsonify(
        [
            {
                'id': req.id,
                'sender_id': req.sender_id,
                'sender_username': req.sender.username,
            }
            for req in friend_requests
        ]
    )


@friend_bp.route('/friend/request/<int:id>/respond', methods=['POST'])
@jwt_required()
def respond_to_friend_request(id):
    action = request.json.get('action')
    user_id = get_jwt_identity()

    friend_request = FriendRequest.query.get(id)
    if not friend_request or friend_request.receiver_id != user_id:
        return jsonify({'message': 'Invalid request.'}), 400

    if action == 'accept':
        friend_request.status = 'accepted'
        sender = User.query.get(friend_request.sender_id)
        receiver = User.query.get(friend_request.receiver_id)
        sender.friends.append(receiver)
        receiver.friends.append(sender)
    elif action == 'reject':
        friend_request.status = 'rejected'
    else:
        return jsonify({'message': 'Invalid action.'}), 400

    db.session.commit()
    return jsonify({'message': f'Request {action}ed.'})
