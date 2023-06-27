from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import uuid

app = Flask(__name__)
# Configuracion de la base de datos 'mysql+pymysql://user:password@localhost/tasksdb'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/tasksdb'
db = SQLAlchemy(app)
ma = Marshmallow(app)
CORS(app)

# Creación del modelo del controlador
class Task(db.Model):
    uuid = db.Column(db.String(36), primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(200))
    fecha = db.Column(db.String(10))
    completado = db.Column(db.Boolean, default=False)

    def __init__(self, uuid, nombre, descripcion, fecha, completado):
        self.uuid = uuid
        self.nombre = nombre
        self.descripcion = descripcion
        self.fecha = fecha
        self.completado = completado

class TaskSchema(ma.Schema):
    class Meta:
        fields = ('uuid', 'nombre', 'descripcion', 'fecha', 'completado')

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

# Metodos HTTP
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    all_tasks = Task.query.all()
    result = tasks_schema.dump(all_tasks)
    return jsonify(result)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    nombre = request.json.get('nombre')
    descripcion = request.json.get('descripcion')
    fecha = request.json.get('fecha', '2023-01-01')
    completado = request.json.get('completado', False)

    if not nombre:
        return jsonify(error='El nombre es requerido'), 400

    uuid_str = str(uuid.uuid4())
    new_task = Task(uuid=uuid_str, nombre=nombre, descripcion=descripcion, fecha=fecha, completado=completado)
    db.session.add(new_task)
    db.session.commit()
    return task_schema.jsonify(new_task)

@app.route('/api/tasks/<uuid>', methods=['PUT'])
def update_task(uuid):
    task = Task.query.get(uuid)
    if task is None:
        return jsonify(error='No se encuentra la tarea'), 404

    nombre = request.json.get('nombre')
    descripcion = request.json.get('descripcion')
    fecha = request.json.get('fecha', '2023-01-01')
    completado = request.json.get('completado')

    if not nombre:
        return jsonify(error='El nombre es requerido'), 400

    task.nombre = nombre
    task.descripcion = descripcion
    task.fecha = fecha
    task.completado = completado
    db.session.commit()
    return task_schema.jsonify(task)

@app.route('/api/tasks/<uuid>', methods=['DELETE'])
def delete_task(uuid):
    task = Task.query.get(uuid)
    if task is None:
        return jsonify(error='No se encuentra la tarea'), 404

    db.session.delete(task)
    db.session.commit()
    return task_schema.jsonify(task)

with app.app_context():
    # Crear la tabla en la base de datos
    db.create_all()

if __name__ == '__main__':
    app.run()