package api

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/charmbracelet/log"
	"github.com/gin-gonic/gin"
	"github.students.cs.ubc.ca/CPSC304-2023W-T1/project_g4g9q_q7d9h_s0d7t/database"
	"golang.org/x/crypto/bcrypt"
)

const Port = 8000

type API struct {
	database *database.Database
}

func (api *API) checkErr(err error, c *gin.Context) bool {
	if err != nil {
		log.Error(err.Error())
		c.JSON(500, gin.H{"status": "error", "message": err.Error()})
		return true
	}

	return false
}

func New(database *database.Database) (*API, error) {
	api := API{
		database: database,
	}
	return &api, nil
}

func (api *API) Run() error {
	r := gin.Default()

	middleware := func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// restrict for non demo ofc
		c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
	r.Use(middleware)

	r.POST("/login", api.login)
	r.POST("/insert", api.insert)
	r.POST("/delete", api.delete)
	r.POST("/update", api.update)
	r.POST("/select", api.selection)
	r.GET("/projection", api.projectionTables)
	r.POST("/projection", api.projectionRows)
	r.POST("/join", api.join)
	r.GET("/aggregationGroup", api.aggregationGroup)
	r.GET("/aggregationHaving", api.aggregationHaving)
	r.GET("/aggregationNested", api.aggregationNested)
	r.GET("/division", api.division)

	err := r.Run(fmt.Sprintf(":%v", Port))
	if err != nil {
		log.Error(err.Error())
	}
	return err
}

func (api *API) login(c *gin.Context) {
	var data struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if api.checkErr(c.BindJSON(&data), c) {
		return
	}

	var userID int
	var password string
	err := api.database.Conn.QueryRow("select userID, password from Users where username = $1", data.Username).Scan(&userID, &password)
	if err == sql.ErrNoRows {
		api.checkErr(err, c)
		return
	} else if err != nil {
		api.checkErr(err, c)
		return
	}

	log.Debugf("checking password '%v' == '%v' for %v'", data.Password, password, userID)
	if err = bcrypt.CompareHashAndPassword([]byte(password), []byte(data.Password)); err != nil {
		c.JSON(400, gin.H{"status": "error", "message": "invalid password"})
		return
	}
	log.Debugf("successful log in for %v", userID)

	c.SetCookie("uid", fmt.Sprintf("%v", userID), 3600, "/", "", false, false)
	c.JSON(200, gin.H{"status": "success"})
}

func (api *API) insert(c *gin.Context) {
	uid, err := c.Cookie("uid")
	if api.checkErr(err, c) {
		return
	}

	var data struct {
		Hash         string `json:"hash"`
		CategoryName string `json:"categoryName"`
	}
	if api.checkErr(c.BindJSON(&data), c) {
		return
	}

	var categoryID int
	err = api.database.Conn.QueryRow("select categoryID from Categories where name = $1", data.CategoryName).Scan(&categoryID)
	if err == sql.ErrNoRows {
		err := api.database.Conn.QueryRow("insert into Categories (name) values ($1) returning categoryID", data.CategoryName).Scan(&categoryID)
		if api.checkErr(err, c) {
			return
		}
	} else if err != nil {
		api.checkErr(err, c)
		return
	}

	_, err = api.database.Conn.Exec("insert into Torrents (hash, name, size, uploaded, categoryID, userID) values ($1, $2, $3, $4, $5, $6)", data.Hash, "insertedName", 1, "2000-03-10 00:00:00", categoryID, uid)
	if api.checkErr(err, c) {
		return
	}

	c.JSON(200, gin.H{"status": "success"})
}

func (api *API) delete(c *gin.Context) {
	uid, err := c.Cookie("uid")
	if api.checkErr(err, c) {
		return
	}

	_, err = api.database.Conn.Exec("delete from Users where userID = $1", uid)
	if api.checkErr(err, c) {
		return
	}

	c.JSON(200, gin.H{"status": "success"})
}

func (api *API) update(c *gin.Context) {
	var data struct {
		Hash         string `json:"hash"`
		CategoryName string `json:"categoryName"`
	}
	if api.checkErr(c.BindJSON(&data), c) {
		return
	}

	var categoryID int
	err := api.database.Conn.QueryRow("select categoryID from Categories where name = $1", data.CategoryName).Scan(&categoryID)
	if err == sql.ErrNoRows {
		err := api.database.Conn.QueryRow("insert into Categories (name) values ($1) returning categoryID", data.CategoryName).Scan(&categoryID)
		if api.checkErr(err, c) {
			return
		}
	} else if err != nil {
		api.checkErr(err, c)
		return
	}

	_, err = api.database.Conn.Exec("update Torrents set categoryID = $1 where hash = $2", categoryID, data.Hash)
	if api.checkErr(err, c) {
		return
	}

	c.JSON(200, gin.H{"status": "success"})
}

func (api *API) selection(c *gin.Context) {
	var data struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		And         bool   `json:"and"`
	}

	if api.checkErr(c.BindJSON(&data), c) {
		return
	}

	// select all tags where name contains data.Name and description contains data.Description, use and if data.And is true otherwise use or
	mode := "or"
	if data.And {
		mode = "and"
	}

	rows, err := api.database.Conn.Query("select name, description from Tags where name like '%' || $1 || '%' "+mode+" description like '%' || $2 || '%'", data.Name, data.Description)
	if api.checkErr(err, c) {
		return
	}
	var tags [][2]string
	for rows.Next() {
		var name string
		var description string
		err := rows.Scan(&name, &description)
		if api.checkErr(err, c) {
			return
		}
		tags = append(tags, [...]string{name, description})
	}

	c.JSON(200, gin.H{"status": "success", "tags": tags})
}

func (api *API) projectionTables(c *gin.Context) {
	rows, err := api.database.Conn.Query("select table_name, column_name from information_schema.columns where table_schema = 'public'")
	if api.checkErr(err, c) {
		return
	}

	tableColumns := make(map[string][]string)

	for rows.Next() {
		var table string
		var column string
		err := rows.Scan(&table, &column)
		if api.checkErr(err, c) {
			return
		}

		if _, ok := tableColumns[table]; !ok {
			tableColumns[table] = make([]string, 0)
		}

		tableColumns[table] = append(tableColumns[table], column)
	}

	c.JSON(200, gin.H{"status": "success", "tables": tableColumns})
}

func (api *API) projectionRows(c *gin.Context) {
	var data struct {
		Table   string   `json:"table"`
		Columns []string `json:"columns"`
	}

	if api.checkErr(c.BindJSON(&data), c) {
		return
	}
	if len(data.Table) == 0 || len(data.Columns) == 0 {
		c.JSON(400, gin.H{"status": "error", "message": "missing table or columns"})
		return
	}

	// verify that all items in data.Columns are valid columns in data.Table
	rows, err := api.database.Conn.Query("select column_name from information_schema.columns where table_schema = 'public' and table_name = $1", data.Table)
	if api.checkErr(err, c) {
		return
	}

	validColumns := make(map[string]bool)
	for rows.Next() {
		var column string
		err := rows.Scan(&column)
		if api.checkErr(err, c) {
			return
		}

		validColumns[column] = true
	}

	for _, column := range data.Columns {
		if _, ok := validColumns[column]; !ok {
			c.JSON(400, gin.H{"status": "error", "message": fmt.Sprintf("invalid column: %v", column)})
			return
		}
	}

	// not vuln to SQLI because we are checking that all columns are valid
	rows, err = api.database.Conn.Query("select " + strings.Join(data.Columns, ", ") + " from " + data.Table)
	if api.checkErr(err, c) {
		return
	}

	var result []map[string]interface{}
	for rows.Next() {
		columnValues := make(map[string]interface{})
		values := make([]interface{}, len(data.Columns))

		for i := range data.Columns {
			values[i] = new(interface{})
		}

		err := rows.Scan(values...)
		if api.checkErr(err, c) {
			return
		}

		for i, column := range data.Columns {
			columnValues[column] = *(values[i].(*interface{}))
		}
		result = append(result, columnValues)
	}

	c.JSON(200, gin.H{"status": "success", "values": result})
}

// search for all torrents that have a tag with description containing `tagDescription`
func (api *API) join(c *gin.Context) {
	var data struct {
		TagDescription string `json:"tagDescription"`
	}

	if api.checkErr(c.BindJSON(&data), c) {
		return
	}

	query := `
		select torrent.hash, torrent.name
		from Torrents torrent
		join TorrentTags torrentTag on torrent.hash = torrentTag.hash
		join Tags tag on torrentTag.tagID = tag.tagID
		where tag.description like '%' || $1 || '%'`
	rows, err := api.database.Conn.Query(query, data.TagDescription)
	if api.checkErr(err, c) {
		return
	}

	var torrents [][2]string
	for rows.Next() {
		var hash string
		var name string
		err := rows.Scan(&hash, &name)
		if api.checkErr(err, c) {
			return
		}
		torrents = append(torrents, [...]string{hash, name})
	}

	c.JSON(200, gin.H{"status": "success", "torrents": torrents})
}

// torrent counts for each type of category (Categories.Name)
func (api *API) aggregationGroup(c *gin.Context) {
	query := `
		select category.name, count(*) 
		from Torrents torrent
		join Categories category on torrent.categoryID = category.categoryID
		group by category.name`
	rows, err := api.database.Conn.Query(query)
	if api.checkErr(err, c) {
		return
	}

	var counts [][2]any
	for rows.Next() {
		var name string
		var count int
		err := rows.Scan(&name, &count)
		if api.checkErr(err, c) {
			return
		}
		counts = append(counts, [...]any{name, count})
	}

	c.JSON(200, gin.H{"status": "success", "counts": counts})
}

// torrent counts for each type of category (Categories.Name) having avg(torrent.size) > 1
func (api *API) aggregationHaving(c *gin.Context) {
	query := `
		select category.name, count(*) 
		from Torrents torrent
		join Categories category on torrent.categoryID = category.categoryID
		group by category.name
		having count(*) > 0 and avg(torrent.size) > 1`
	rows, err := api.database.Conn.Query(query)
	if api.checkErr(err, c) {
		return
	}

	var counts [][2]any
	for rows.Next() {
		var name string
		var count int
		err := rows.Scan(&name, &count)
		if api.checkErr(err, c) {
			return
		}
		counts = append(counts, [...]any{name, count})
	}

	c.JSON(200, gin.H{"status": "success", "counts": counts})
}

func (api *API) aggregationNested(c *gin.Context) {
	query := `
		select category.name, coalesce(avg(commentCount), 0)
		from Categories category
		join Torrents torrent on category.categoryID = torrent.categoryID
		join (
			select hash, count(*) as commentCount
			from Comments
			group by hash
		) as commentCounts on torrent.hash = commentCounts.hash
		group by category.name`
	rows, err := api.database.Conn.Query(query)
	if api.checkErr(err, c) {
		return
	}

	var counts [][2]any
	for rows.Next() {
		var roleName string
		var avgUserAge float64
		err := rows.Scan(&roleName, &avgUserAge)
		if api.checkErr(err, c) {
			return
		}
		counts = append(counts, [...]any{roleName, avgUserAge})
	}

	c.JSON(200, gin.H{"status": "success", "counts": counts})
}

// find users that have downloaded all the torrents
// achievement: download all torrents!
func (api *API) division(c *gin.Context) {
	query := `
	select usr.username
	from Users usr
	where not exists (
		select torrent.hash
		from Torrents torrent
		where not exists (
			select history.hash
			from History history
			where history.userID = usr.userID and history.hash = torrent.hash))` // `user` is a reserved keyword in postgres
	rows, err := api.database.Conn.Query(query)
	if api.checkErr(err, c) {
		return
	}

	var users []string
	for rows.Next() {
		var username string
		err := rows.Scan(&username)
		if api.checkErr(err, c) {
			return
		}
		users = append(users, username)
	}

	c.JSON(200, gin.H{"status": "success", "users": users})
}
