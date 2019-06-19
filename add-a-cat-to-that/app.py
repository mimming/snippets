# Copyright 2019 Google, Inc.
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

import os
import random
import string
from flask import Flask, request, render_template, redirect, url_for, session, jsonify, json
from PIL import Image
import webauthn


# Our not-really-a-database
admin_users = {
    'admin@example.com': {
        'id': '42',
        'email': 'admin@example.com',
        'password': '1234'
    }
}

app = Flask(__name__)

# Set the secret key used for sessions and stuff.  Please don't use it like this in production.
app.secret_key = b'correct-horse-battery-staple'

# Random seed for the cat selection, and security key challenge generation
random.seed(os.urandom(16))

@app.route('/improve', methods=['POST'])
def add_a_cat_post():
    r = str(random.randrange(1000000, 9000000))
    cat = str(random.randrange(1, 5))

    wip = 'image-to-cat-' + r
    bip = 'static/better-image-' + r + '.png'
    catip = './cats/cat' + cat + '.png'

    f = request.files['image-to-cat']
    f.save(wip)

    c = request.form['caption']


    img = Image.open(wip, 'r')

    img_cat = Image.open(catip, 'r')

    img.paste(img_cat, (0, img.height - img_cat.height), mask=img_cat)

    img.save(bip)

    return render_template('better.html', caption=c, img_path=bip)


@app.route('/')
def add_a_cat():
    return render_template('upload.html')


@app.route('/admin-login')
def admin_login_form():
    return render_template('admin-login-form.html')


@app.route('/admin-login', methods=['POST'])
def admin_login():
    email = request.form['email']
    password = request.form['password']

    if email in admin_users:
        if password == admin_users[email]['password']:
            session['email'] = email
            return redirect(url_for('admin_settings'))

    # Fall through to user not found
    error = "The email " + email + " was not found.  Please keep guessing emails that might work."

    return render_template('admin-login-form.html', error=error)

@app.route('/admin-settings')
def admin_settings():
    # Verify logged in state
    if 'email' in session and session['email'] in admin_users:
        current_user = admin_users[session['email']]

        # Select WebAuthn required values
        challenge = generate_random_string(32)
        rp_name = 'Add a Cat to That'
        rp_id = 'localhost'

        user_id = current_user['id']
        username = current_user['email']
        display_name = current_user['email']
        icon_url = ''

        timeout = 60000
        attestation = 'none'

        # Make credentials_options for our values
        credential_options = webauthn.WebAuthnMakeCredentialOptions(
            challenge,
            rp_name,
            rp_id,
            user_id,
            username,
            display_name,
            icon_url,
            timeout,
            attestation)

        # JSON encode it for use in JavaScript land
        json_credential_options = json.dumps(credential_options.registration_dict)

        # Get a list of known security keys for this user
        known_keys = {}
        if 'known_keys' in current_user:
            known_keys = current_user['known_keys']

        return render_template('admin-settings.html', email=session['email'], credential_options=json_credential_options, known_keys=known_keys)

    else:
        return redirect(url_for('admin_login'))


def generate_random_string(string_length):
    return ''.join([
        random.SystemRandom().choice(string.ascii_letters + string.digits) for i in range(string_length)
    ])

if __name__ == "__main__":
    app.run(debug=True, host='localhost', port=int(os.environ.get('PORT', 5000)))

