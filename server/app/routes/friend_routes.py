from flask import Blueprint
from app.controllers.friend_request_controller import (
    send_friend_request,
    get_friend_requests,
    respond_to_friend_request,
)

friend_bp = Blueprint('friend_bp', __name__)


friend_bp.route('/request', methods=['POST'])(send_friend_request)
friend_bp.route('/requests', methods=['GET'])(get_friend_requests)
friend_bp.route('/requests/<int:request_id>', methods=['POST'])(
    respond_to_friend_request
)
