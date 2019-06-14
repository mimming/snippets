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
from flask import Flask, request, render_template, redirect, url_for
from PIL import Image

admin_users = [
    {
        'email':'admin@example.com',
        'password':'1234'
    }
]


app = Flask(__name__)
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

    # img = img.convert('RGB')
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

    for admin_user in admin_users:
        if email == admin_user['email'] and password == admin_user['password']:
            return redirect(url_for('admin_settings'))

    # Fall through to user not found
    error = "The email " + email + " was not found.  Please keep guessing emails that might work."

    return render_template('admin-login-form.html', error=error)

@app.route('/admin-settings')
def admin_settings():
    return render_template('admin-settings.html')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

