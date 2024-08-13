import unittest
from datetime import timedelta
from flask_jwt_extended import create_access_token
from app import create_app, db
from app.models.user_model import User


class TestAuth(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_register(self):
        response = self.client.post(
            '/auth/register',
            json={
                'username': 'testuser',
                'email': 'test@example.com',
                'password': 'password',
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn('User registered successfully', response.get_json()['message'])

    def test_login(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('password')
        db.session.add(user)
        db.session.commit()

        response = self.client.post(
            '/auth/login', json={'email': 'test@example.com', 'password': 'password'}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn('Login successful', response.get_json()['message'])

    def test_invalid_login(self):
        response = self.client.post(
            '/auth/login', json={'email': 'invalid@example.com', 'password': 'password'}
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn('Invalid email or password', response.get_json()['message'])

    def test_logout(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('password')
        db.session.add(user)
        db.session.commit()

        response = self.client.post(
            '/auth/login', json={'email': 'test@example.com', 'password': 'password'}
        )
        access_token = response.get_json()['access_token']

        self.client.set_cookie('localhost', 'access_token_cookie', access_token)

        response = self.client.post('/auth/logout')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Logout successful', response.get_json()['message'])

    def test_token_expiry(self):
        with self.app.app_context():
            token = create_access_token(identity=1, expires_delta=timedelta(seconds=1))

        import time

        time.sleep(2)

        response = self.client.get(
            '/protected', headers={'Authorization': f'Bearer {token}'}
        )
        self.assertEqual(response.status_code, 401)

    def test_password_hashing(self):
        user = User(username='testuser', email='test@example.com')
        user.set_password('password')
        db.session.add(user)
        db.session.commit()

        db_user = User.query.filter_by(username='testuser').first()
        self.assertTrue(db_user.check_password('password'))
        self.assertNotEqual(db_user.password_hash, 'password')


if __name__ == '__main__':
    unittest.main()
