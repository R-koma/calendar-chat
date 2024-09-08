import eventlet

eventlet.monkey_patch()


def create_app_and_run():
    from app import create_app, socketio

    app = create_app()

    if __name__ == '__main__':
        socketio.run(app, host='0.0.0.0', port=5001)


if __name__ == '__main__':
    create_app_and_run()
