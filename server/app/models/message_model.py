from app import db
from datetime import datetime


class Message(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.now)

    event = db.relationship('Event', backref='messages')
    user = db.relationship('User', backref='messages')
