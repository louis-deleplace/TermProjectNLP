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

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'db'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'songs'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

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


if __name__ == '__main__':
    app.run(host='0.0.0.0')
