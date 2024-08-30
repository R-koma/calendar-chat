from flask import Blueprint
from app.controllers.event_controller import (
    create_event,
    get_participated_events,
)


event_bp = Blueprint('event_bp', __name__)

event_bp.route('/create', methods=['POST'])(create_event)
event_bp.route('/user/participated-events', methods=['GET'])(get_participated_events)
