#coding:utf-8
from flask import render_template,redirect,url_for,request
from . import authorityBp
from app.model import fishDataModel
from flask import request
from flask import json
import psycopg2
import uuid
#login
@authorityBp.route('/',methods=['GET','POST'])
def gate():
    return render_template('index.html',title='')
    #return render_template('login.html', title='')
@authorityBp.route('/mobile',methods=['GET','POST'])
def index():
    return render_template('mobilemap.html',title='')
        

@authorityBp.route('/login',methods=['GET','POST'])
def login():
    #return "TODO"
    token = uuid.uuid4()
    #解析表单数据
    data = json.loads(request.form.get('data'))
    username = data['username']
    password = data['psw']
    a = data['a1']
    connect = psycopg2.connect(database="jiashanFish", user="postgres", password="vgelab010", host="119.23.128.14",
                              port="5432")
    cur = connect.cursor()
    try:
        sql = "SELECT pass FROM login where gid='"+username+"'"

        cur.execute(sql)
        rows = cur.fetchall()
        rows = rows[0]

        connect.commit()
        cur.close()
        connect.close()

        rows = str(rows)
        password = "('"+password+"',)"
        password = str(password)
        #print rows
        #print password
        if password == rows:
            #print 'success'正确
            b = '{"token":"%s","a":0}' % str(token)
            return b
            #return render_template('index.html', username=username)

        else:
            #print 'false'密码错误
            a=1
            return '{"a":"%s"}' % a
    except:
        #该用户名在数据库中不存在
        connect.commit()
        cur.close()
        connect.close()
        a=1
        return '{"a":"%s"}' % a

# @authorityBp.route('/signOut',methods=['GET','POST'])
# def signOut():
#     return render_template('login.html',title='')