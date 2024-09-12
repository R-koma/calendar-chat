from flask import Blueprint
from app.controllers.event_controller import (
    create_event,
    update_event,
    delete_event,
    get_participated_events,
    respond_to_event,
    get_event_detail,
    invite_more_friends,
)


event_bp = Blueprint('event_bp', __name__)

event_bp.route('/create', methods=['POST'])(create_event)
event_bp.route('/<int:event_id>/update', methods=['PUT'])(update_event)
event_bp.route('/<int:event_id>/delete', methods=['DELETE'])(delete_event)
event_bp.route('/user/participated-events', methods=['GET'])(get_participated_events)
event_bp.route('/respond', methods=['POST'])(respond_to_event)
event_bp.route('/<int:event_id>/detail', methods=['GET'])(get_event_detail)
event_bp.route('/<int:event_id>/invite', methods=['POST'])(invite_more_friends)
