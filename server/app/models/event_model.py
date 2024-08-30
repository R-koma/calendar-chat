from .. import db
from datetime import datetime, timezone, timedelta


jst = timezone(timedelta(hours=9))


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(100), nullable=False)
    event_date = db.Column(db.DateTime, nullable=True)
    meeting_time = db.Column(db.String(50), nullable=True)
    meeting_place = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(jst))

    creator = db.relationship('User', backref='created_events')
    invites = db.relationship('EventInvite', backref='event', lazy=True)


class EventInvite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')

    __table_args__ = (
        db.UniqueConstraint('event_id', 'user_id', name='unique_event_user_invite'),
    )

    user = db.relationship('User', backref='event_invites')


class EventParticipant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    event = db.relationship('Event', backref='participants')
    user = db.relationship('User', backref='participated_events')
