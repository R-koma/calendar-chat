from flask import Blueprint, request, jsonify
from app.models.user_model import User

user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/user/search', methods=['GET'])
def search_users():
    query = request.args.get('query', '').strip().lower()
    if not query:
        return jsonify([]), 200

    users = User.query.filter(
        (User.username.ilike(f'%{query}%')) | (User.email.ilike(f'%{query}%'))
    ).all()

    results = [
        {'id': user.id, 'username': user.username, 'email': user.email}
        for user in users
    ]
    return jsonify(results), 200
