from typing import List, Dict
from flask import Flask
import mysql.connector
import mysql
import json
import csv
import requests
import xml.etree.ElementTree as ET
from flask_mysqldb import MySQL
from flask import jsonify
from flask_cors import CORS
from flask import request
import numpy
import pandas
import sys
import re


app = Flask(__name__)

app.config['MYSQL_HOST'] = 'db'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'songs'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['CORS_HEADERS'] = 'Content-Type'

CORS(app, resources={r"/*": {"origins": "*"}})
mysql = MySQL(app)


def putIntoTable(title, artist, year, lyrics, genre, popularity, bpm, energy, danceability, song_length):
    try:
        connection = mysql.connector.connect(host='db',
                                             database='songs',
                                             user='root',
                                             password='root')

        mySql_insert_query = """INSERT INTO songs (title, artist, year, lyrics, genre, popularity, bpm, energy, danceability, song_length) 
                            VALUES 
                            (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) """

        record = (title, artist, year, lyrics, genre, popularity,
                  bpm, energy, danceability, song_length)
        cursor = connection.cursor()
        cursor.execute(mySql_insert_query, record)
        connection.commit()
        print(cursor.rowcount, "Record inserted successfully into songs table")
        cursor.close()

    except mysql.connector.Error as error:
        print("Failed to insert record into Laptop table {}".format(error))

    finally:
        if connection.is_connected():
            connection.close()
            print("MySQL connection is closed")


def putDataInTable():
    with open('Spotify-2000.csv', 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            putIntoTable(row['Title'], row['Artist'], int(row['Year']), "", row['Top Genre'], row['Popularity'],
                         row['Beats Per Minute (BPM)'], row['Energy'], row['Danceability'], row['Length (Duration)'])


def getAlldataFromTable():
    try:
        connection = mysql.connector.connect(host='db',
                                             database='songs',
                                             user='root',
                                             password='root')

        sql_select_Query = """select * from songs"""
        cursor = connection.cursor()
        cursor.execute(sql_select_Query)
        # get all records
        records = cursor.fetchall()
        print("Total number of rows in table: ", cursor.rowcount)

        print("\nPrinting each row")
        return records

    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e)
    finally:
        if connection.is_connected():
            connection.close()
            cursor.close()
            print("MySQL connection is closed")


def updateLyrics(lyrics, artist, title):
    try:
        connection = mysql.connector.connect(host='db',
                                             database='songs',
                                             user='root',
                                             password='root')
        sql_select_Query = "select * from songs"
        cursor = connection.cursor()
        sql = """UPDATE songs set lyrics = %s where title = %s and artist = %s"""
        values = (lyrics, title, artist)
        cursor.execute(sql, values)
        connection.commit()
    except mysql.connector.Error as e:
        print("Error reading data from MySQL table", e, flush=True)
        print(artist, title, flush=True)
        print("\n", flush=True)
    finally:
        if connection.is_connected():
            connection.close()
            cursor.close()


def getAllLyrics():
    records = getAlldataFromTable()
    for row in records:
        try:
            url = "http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=" + \
                row[1].lower() + "&song=" + row[0].lower()
            response = requests.request("GET", url)
            root = ET.fromstring(response.text)
            lyrics = root.find("{http://api.chartlyrics.com/}Lyric").text
            updateLyrics(lyrics, row[1], row[0])
        except:
            print("Error for " + row[0] + " by " + row[1], flush=True)


@app.route('/')
def index():
    return "Hello World"


@app.route('/all', methods=["GET"])
def getAll():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM songs")
    data = cursor.fetchall()
    cursor.close()

    return jsonify(data)


@app.route('/song', methods=["GET"])
def getSong():
    artist = request.args.get("artist")
    title = request.args.get("title")
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM songs where artist = " +
                   artist + " AND title = " + title + " LIMIT 1")
    data = cursor.fetchall()
    cursor.close()

    return jsonify(data)


@app.route('/research', methods=["POST"])
def research():
    # request.form
    # data = cursor.fetchall()
    data = pandas.read_sql("SELECT * FROM songs", mysql.connection)
    args = request.get_json()
    UI_BPM = args["UI_BPM"]
    UI_DANCE = args["UI_DANCE"]
    UI_ENERGY = args["UI_ENERGY"]
    lyrics = args["lyrics"]
    title = args["title"]
    artistName = args["artistName"]
    isTitleSearch = args["isTitleSearch"]
    if (isTitleSearch):
        cursor = mysql.connection.cursor()
        sql = "SELECT lyrics FROM songs where artist = %s AND title = %s"
        values = (artistName, title)
        cursor.execute(sql, values)
        res = cursor.fetchall()
        lyrics = res[0]["lyrics"]
    COEF_BPM = 2
    COEF_ENERGY = 1
    COEF_DANCE = 1
    # print(UI_BPM, file=sys.stderr)
    data['filter'] = data.apply(lambda x: (COEF_BPM * abs((x['bpm'] - UI_BPM) / UI_BPM) + COEF_ENERGY * abs((x['energy'] - UI_ENERGY) /
                                UI_ENERGY) + COEF_DANCE * abs((x['danceability'] - UI_DANCE) / UI_DANCE)) / (COEF_BPM + COEF_DANCE + COEF_ENERGY), axis=1)
    data = data.sort_values('filter').iloc[0:50]
    data = data.loc[data['lyrics'].str.len() > 0]
    vocabulary = data.copy()['lyrics']

    def process(lyrics):
        if lyrics is None:
            return ['']
        lyrics = lyrics.lower()
        lyrics = ' '.join(lyrics.split('\n'))
        lyrics = re.split('[,.?!:;() \'\"*&-1234567890\[\]\`=_{}]', lyrics)
        lyrics = [x for x in lyrics if x != '']
        return lyrics

    data['lyrics'] = data.apply(lambda x: process(x['lyrics']), axis=1)
    data = data.drop('filter', 1).reset_index(drop=True)
    data = data.append({'lyrics': process(lyrics)}, ignore_index=True)
    vocabulary = sorted(list(set(process(vocabulary.str.cat(sep=' ')))))
    N = len(data['lyrics'])
    vectors = numpy.zeros((N, len(vocabulary)))

    for w in range(len(vocabulary)):
        word = vocabulary[w]
        tf = numpy.array([])
        idf = 0
        for text in data['lyrics']:
            f = 0
            if word in text:
                idf += 1
            for t in text:
                if word == t:
                    f += 1
            tf = numpy.append(tf, f / len(text))
        if idf == 0:
            print(word)
        vectors[:, w] = tf * numpy.log(N / idf)
    vectors = pandas.DataFrame(vectors, columns=vocabulary)

    def cosine(x, y):
        try:
            return numpy.divide(numpy.dot(x, y), numpy.multiply(numpy.sqrt(numpy.dot(x, x)), numpy.sqrt(numpy.dot(y, y))))
        except Exception:
            return 0

    data['similarity'] = vectors.apply(lambda x: round(100 * cosine(
        numpy.array(x), vectors.iloc[-1, :]), 2), axis=1)
    data = data.iloc[:-1].sort_values('similarity',
                                      ascending=False)
    return data[['title', 'artist', 'bpm', 'energy', 'danceability', 'similarity']].to_json(orient='records')


if __name__ == '__main__':
    app.run(host='0.0.0.0')
