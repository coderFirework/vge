#coding:utf-8
from app import db
class Fish(db.Model):
    __tablename__='nanhu'
    #id = db.Column(db.Integer, primary_key=True)
    #username = db.Column(db.String(80), unique=True)
    #email = db.Column(db.String(120), unique=True)
    gid = db.Column(db.Integer,primary_key=True)
    name=db.Column(db.CHAR(80),nullable=True)
    area= db.Column(db.Float,nullable=True)
    address=db.Column(db.CHAR(200),nullable=True)
    description=db.Column(db.CHAR(200),nullable=True)
    # ssxz=db.Column(db.CHAR(50),nullable= True)

    def __init__(self,name,area,address,description):
        self.name = name
        self.area = area
        self.address = address
        self.description = description

    def __repr__(self):
        return '<Fish %r>' % self.name
#fishes = Fish.query.all()
#print(fishes)