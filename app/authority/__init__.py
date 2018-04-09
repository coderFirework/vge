from flask import Blueprint
authorityBp = Blueprint('authority',__name__,static_url_path='../static', template_folder='templates')

from . import views