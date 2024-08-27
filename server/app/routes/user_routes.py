from flask import Blueprint
from app.controllers.user_controller import search_users, get_friends

user_bp = Blueprint('user_bp', __name__)


user_bp.route('/search', methods=['GET'])(search_users)
user_bp.route('/friends', methods=['GET'])(get_friends)
