from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    first_name = db.Column(db.String(120), unique=True, nullable=False)
    last_name = db.Column(db.String(120), unique=True, nullable=False)
    favorite_cocktails = db.relationship('FavoriteCocktail', backref='user', lazy=True)
    

    def __repr__(self):
        return self.first_name

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name
            # do not serialize the password, its a security breach
        }


class Cocktail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    instructions = db.Column(db.String(120), unique=True, nullable=False)
    ingredients = db.Column(db.String(120), unique=True, nullable=False)
    measurements= db.Column(db.String(120), unique=True, nullable=False)
    favorite_cocktails = db.relationship('FavoriteCocktail', backref='cocktail', lazy=True)
   
    

    def __repr__(self):
        return self.name

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "instructions": self.instructions,
            "ingredients": self.ingredients,
            "measurements": self.measurements
            # do not serialize the password, its a security breach
        }

class FavoriteCocktail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    cocktail_id = db.Column(db.Integer, db.ForeignKey('cocktail.id'), nullable=False)
   

    def __repr__(self):
        return self.user_id

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "instructions": self.instructions,
            "ingredients": self.ingredients,
            "measurements": self.measurements
            # do not serialize the password, its a security breach
        }