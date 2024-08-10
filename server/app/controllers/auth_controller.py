import logging

from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    unset_jwt_cookies,
    get_jwt,
)
from app.models.user_model import User
from app import db
from app.utils.token_utils import revoke_token

auth_bp = Blueprint('auth_bp', __name__)


@auth_bp.route('/auth/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already registered'}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to register user', 'error': str(e)}), 500
    return jsonify({'message': 'User registered successfully'}), 201


@auth_bp.route('/auth/login', methods=['POST'])
def login_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        response = make_response(jsonify({"message": "Login successful"}), 200)
        set_access_cookies(response, access_token)
        return response
    else:
        return jsonify({"message": "Invalid email or password"}), 401


@auth_bp.route('/auth/logout', methods=['POST'])
def logout_user():
    jwt_data = get_jwt()
    jti = jwt_data.get('jti')
    revoke_token(jti)

    response = jsonify({'message': 'Logout successful'})
    unset_jwt_cookies(response)

    logging.info(f"Token {jti} has been revoked.")

    return response
