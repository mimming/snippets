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
import subprocess
import random
from flask import Flask, request, render_template, abort, redirect, url_for

app = Flask(__name__)
random.seed(os.urandom(16))

@app.route('/improve', methods=['POST'])
def add_a_cat_post():
    r = str(random.randrange(1000000, 9000000))
    cat = str(random.randrange(1, 5))

    wip = 'image-to-cat-' + r
    bip = 'static/better-image-' + r + '.jpg'
    catip = './cats/cat' + cat + '.png'

    f = request.files['image-to-cat']
    f.save(wip)


    c = request.form['caption']
    
    sp = subprocess.run(["composite", "-gravity", "SouthWest", catip, wip, bip])

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

    error = "The email " + email + " was not found.  Please keep guessing emails that might work."

    return render_template('admin-login-form.html', error=error)


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))

