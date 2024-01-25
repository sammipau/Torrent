package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/pkg/errors"
)

type Database struct {
	Conn *sql.DB
}

func New(name, user, pass, host string, port int) (*Database, error) {
	conn, err := sql.Open("postgres", fmt.Sprintf("user=%s password=%s dbname=%s host=%s port=%d sslmode=disable", user, pass, name, host, port))
	if err != nil {
		return nil, errors.Wrap(err, "failed to open database connection")
	}

	err = conn.Ping()
	if err != nil {
		return nil, errors.Wrap(err, "failed to ping database")
	}

	db := Database{
		Conn: conn,
	}

	return &db, nil
}

func (db *Database) Close() error {
	return db.Conn.Close()
}
