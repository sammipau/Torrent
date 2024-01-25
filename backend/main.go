package main

import (
	"os"
	"strconv"

	"github.com/charmbracelet/log"
	"github.students.cs.ubc.ca/CPSC304-2023W-T1/project_g4g9q_q7d9h_s0d7t/api"
	"github.students.cs.ubc.ca/CPSC304-2023W-T1/project_g4g9q_q7d9h_s0d7t/database"
)

const (
	dbUserDefault = "backend"
	dbPassDefault = "backend"
	dbNameDefault = "backend"
	dbHostDefault = "localhost"
	dbPortDefault = 5432
)

func main() {
	log.SetLevel(log.DebugLevel)
	log.Info("Initializing backend...")

	dbUser, dbPass, dbName, dbHost, dbPort := dbUserDefault, dbPassDefault, dbNameDefault, dbHostDefault, dbPortDefault
	dbUserEnv, dbPassEnv, dbNameEnv, dbHostEnv, dbPortEnv := os.Getenv("DB_USER"), os.Getenv("DB_PASS"), os.Getenv("DB_NAME"), os.Getenv("DB_HOST"), os.Getenv("DB_PORT")
	if dbUserEnv != "" {
		dbUser = dbUserEnv
	}
	if dbPassEnv != "" {
		dbPass = dbPassEnv
	}
	if dbNameEnv != "" {
		dbName = dbNameEnv
	}
	if dbHostEnv != "" {
		dbHost = dbHostEnv
	}
	if dbPortEnv != "" {
		i, err := strconv.Atoi(dbPortEnv)
		if err != nil {
			log.Fatal(err)
		}
		dbPort = i
	}

	database, err := database.New(dbUser, dbPass, dbName, dbHost, dbPort)
	if err != nil {
		log.Fatal(err)
	}

	server, err := api.New(database)
	if err != nil {
		log.Fatal(err)
	}

	server.Run()

	log.Info("Exiting backend")
}
