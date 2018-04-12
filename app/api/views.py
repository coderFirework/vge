#coding:utf-8
import sys,urllib
from flask import json
from flask import request
import string,re
from . import apiBp
import psycopg2
import os
import base64
import time

@apiBp.route('/query',methods=['GET','POST'])
def query():
    data = json.loads(request.form.get('data'))
    ss = data['url']
    #print (ss)
    #wp = urllib.request.urlopen(ss)  # 打开连接
    wp = urllib.urlopen(ss)
    content = wp.read()  # 获取页面内容
    content = content.replace('ssrmc','所属人名称')
    content = content.replace('yzmj','养殖面积')
    content = content.replace('yzpz','养殖品种')
    content = content.replace('lxhf','类型划分')
    content = content.replace('fish','')
    #print content
    return content

@apiBp.route('/id',methods=['GET','POST'])
def getID():
    data = json.loads(request.form.get('data'))
    ss = data['url']
    #print (ss)
    # wp = urllib.request.urlopen(ss)  # 打开连接
    wp = urllib.urlopen(ss)
    content = wp.read()  # 获取页面内容
    #<td>fish.944</td>
    r='fish\..*</td>'
    if(re.search(r,content)):
        line = re.search(r,content)
        #fish.1138</td>
        r2="\d+"
        id=re.search(r2,line.group())
        #print id.group()
        return id.group()
    return "none"


def getPath():
    root=os.getcwd()
    imagePath=os.path.join(root,'app\static\images\upload')
    t=time.time()
    imagename=str(int(t))+'.jpg'
    fullpath=os.path.join(imagePath,imagename)
    return (imagename,fullpath)

@apiBp.route('/appcreatefeature',methods=['GET','POST'])
def createfeature():
    name=request.form.get('name')
    address=request.form.get('address')
    geo=request.form.get('geo')
    pic=request.form.get('pic')
    description=request.form.get('description')
    imageurl="image"
    area=request.form.get('area')
    farea = float(area)

    imgdata=base64.b64decode(pic)
    imagename,path=getPath()
    imageurl=imagename
    file=open(path,'wb')
    file.write(imgdata)
    file.close()

    connect = psycopg2.connect(database="webGIS", user="postgres", password="vgelab010", host="119.23.128.14",
                              port="5432")
    cur = connect.cursor()
    try:
        geoData="ST_GeomFromText('"+geo+"')"
        sql = "insert into nanhu (name,address,description,area,geom,imageurl) values ('%s','%s','%s',%.2f,%s,'%s')"%(name,address,description,farea,geoData,imageurl)
        print sql
        cur.execute(sql)
        connect.commit()
        cur.close()
        connect.close()
    except Exception,e:
        connect.commit()
        cur.close()
        connect.close()
        a=1
        print e.message
        return '{"a":"%s"}' % a

    return "ok"


