from .. import db


class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')

    sender = db.relationship('User', foreign_keys=[sender_id], backref='sent_requests')
    receiver = db.relationship(
        'User', foreign_keys=[receiver_id], backref='received_requests'
    )

    def __repr__(self):
        return f'<FriendRequest from {self.sender_id} to {self.receiver_id}>'
