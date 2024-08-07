import unittest
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
        response = self.client.post('/auth/logout')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Logout successful', response.get_json()['message'])
