# coding:utf-8
from app.model import fishDataModel
from flask import request
from flask import json
from . import apiBp
import psycopg2
import string


@apiBp.route('/modify', methods=['GET', 'POST'])
# Modify recoder by id,
def modify():
    data = json.loads(request.form.get('data'))
    id = data['gid']
    name = data['name']
    area = data['area']
    address = data['address']
    description = data['description']
    # type = data['type']
    # print("name is:"+name)

    fish = fishDataModel.Fish.query.filter_by(gid=id).first()
    fish.name = name
    fish.area = area
    fish.address = address
    fish.description = description
    fishDataModel.db.session.commit()
    return ('success')

@apiBp.route('/cancle',methods=['GET','POST'])
def deleteRowByID():
    #return("i got it")
    data = json.loads(request.form.get('data'))
    print(data)
    id = data['gid']
    print(id)
    fish = fishDataModel.Fish.query.filter_by(gid=id).first()
    fishDataModel.db.session.delete(fish)
    fishDataModel.db.session.commit()
    return('success')


#
@apiBp.route('/initialssxz', methods=['GET', 'POST'])
# def initialssxz():
#     data = json.loads(request.form.get('data'))
#     id = data['gid']
#     ssxz = data['ssxz']
#
#     fish = fishDataModel.Fish.query.filter_by(gid=id).first()
#     fish.ssxz = ssxz
#     fishDataModel.db.session.commit()
#     return (fish.ssxz)
def initialssxz():
    data = json.loads(request.form.get('data'))
    id = data['gid']
    address = data['address']

    fish = fishDataModel.Fish.query.filter_by(gid=id).first()
    fish.address = address
    fishDataModel.db.session.commit()
    return (fish.address)


@apiBp.route('/getAreaInfo', methods=['GET', 'POST'])
def getAreaInfo():
    data = json.loads(request.form.get('data'))
    xz = data["address"]
    type = data["description"]
    amin = data["min"]
    amax = data["max"]
    print amax;
    if amax == "最大值".decode("utf-8"):
        amax = '10000'
    print amax;
    # 数据库连接参数
    connect = psycopg2.connect(database="webGIS", user="postgres", password="vgelab010", host="119.23.128.14",
                               port="5432")
    cur = connect.cursor()
    if amin != "0" or amax != "最大值" and amin != "" and amax != "":
        if type == "all":
            sql = "SELECT sum(area) FROM webGIS WHERE address=" + "'" + xz + "'" + "and area>=" + amin + " and area<=" + amax
            # print sql
        else:
            sql = "SELECT sum(area) FROM webGIS WHERE address=" + "'" + xz + "'" + " and description=" + "'" + type + "'" + "and area>=" + amin + " and area<=" + amax
            # print sql
    else:
        if type == "all":
            sql = "SELECT sum(area) FROM webGIS WHERE address=" + "'" + xz + "'"
            # print sql
        else:
            sql = "SELECT sum(area) FROM webGIS WHERE address=" + "'" + xz + "'" + " and description=" + "'" + type + "'"
            # print sql
    cur.execute(sql)
    rows = cur.fetchall()
    for i in rows:
        mj = str(i[0]).decode("utf-8")
        if mj == "None":
            mj = "0"
    connect.commit()
    cur.close()
    connect.close()
    return mj


@apiBp.route('/getAreaByName', methods=['GET', 'POST'])
def getAreaByName():
    addressarr = ["中国"]
    # data = json.loads(request.form.get('data'))
    # xz = data["ssxz"]
    # 数据库连接参数
    connect = psycopg2.connect(database="webGIS", user="postgres", password="vgelab010", host="119.23.128.14",
                               port="5432")
    cur = connect.cursor()
    allinfo = []
    for k in addressarr:
        sql = "SELECT name,sum(area) FROM nanhu WHERE address=" + "'" + k + "'" + " group by description"
        cur.execute(sql)
        rows = cur.fetchall()
        arr = [0, 0, 0, 0, 0]
        for j in rows:
            type = str(j[0]).decode("utf-8")
            mj = j[1]
            if type == "违建".decode("utf-8"):
                arr[1] = mj
            # elif type == "鱼塘".decode("utf-8"):
            #     arr[2] = mj
            # elif type == "外荡".decode("utf-8"):
            #     arr[3] = mj
            # elif type == "未归类".decode("utf-8"):
            #     arr[4] = mj
        # arr[0] = arr[1]+ arr[2] + arr[3] + arr[4]
        arr[0] = arr[1]
        allinfo.append(arr)
    print allinfo
    connect.commit()
    cur.close()
    connect.close()
    return str(allinfo)


@apiBp.route('/getAllArea', methods=['GET', 'POST'])
def getAllArea():
    connect = psycopg2.connect(database="webGIS", user="postgres", password="vgelab010", host="119.23.128.14",
                               port="5432")
    cur = connect.cursor()
    sql = "SELECT sum(area),count(*) FROM nanhu"
    cur.execute(sql)
    rows = cur.fetchall()
    arr = [0, 0, 0, 0, 0]
    print rows
    for i in rows:
        # type = str(i[0]).decode("utf-8")
        # print type
        mj = i[0]
        arr[0] = mj
        arr[1] = float(i[1])
        # if type == "违建".decode("utf-8"):
        #     arr[1] = mj
        #     # print "arr[1]",arr[1]
        # else:
        #     arr[2] = mj + arr[2]
            # print "arr[2]",arr[2]

    # arr[0] = arr[1] + arr[2]
    connect.commit()
    cur.close()
    connect.close()
    # return str(arr).decode("utf-8")
    return str(arr)
# 登陆
#
  #  data = json.loads(request.form.get('data'))
   # gid = data['gid']
    #passa = data['pass']

    #connect = psycopg2.connect(database="jiashanFish", user="postgres", password="vgelab010", host="119.23.128.14",
     #                          port="5432")
    # cur = connect.cursor()
    #sql = "SELECT pass FROM login where gid="+gid
    
    # cur.execute(sql)
    # rows = cur.fetchall()
    # arr = [0, 0, 0, 0, 0]
    # for i in rows:
    #     type = str(i[0]).decode("utf-8")
    #     mj = i[1]
    #     if type == "围养".decode("utf-8"):
    #         arr[1] = mj
    #     elif type == "鱼塘".decode("utf-8"):
    #         arr[2] = mj
    #     elif type == "外荡".decode("utf-8"):
    #         arr[3] = mj
    #     elif type == "未归类".decode("utf-8"):
    #         arr[4] = mj
    # arr[0] = arr[1] + arr[2] + arr[3] + arr[4]
    # print arr[0]
    #connect.commit()
    # cur.close()
    #connect.close()
    #if sql=='':        
     #   return '用户名、密码错误' 
    #elif passa == sql: 
     #   return '登陆成功'
    #else:
      #  return '用户名、密码错误'            
    # return str(arr).decode("utf-8")
