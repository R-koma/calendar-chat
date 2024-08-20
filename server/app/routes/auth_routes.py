from flask import Blueprint
from ..controllers.auth_controller import (
    register_user,
    login_user,
    logout_user,
    protected,
    get_user,
)

auth_bp = Blueprint('auth_bp', __name__)

auth_bp.route('/register', methods=['POST'])(register_user)
auth_bp.route('/login', methods=['POST'])(login_user)
auth_bp.route('/logout', methods=['POST'])(logout_user)
auth_bp.route('/protected', methods=['GET'])(protected)
auth_bp.route('/user', methods=['GET'])(get_user)
