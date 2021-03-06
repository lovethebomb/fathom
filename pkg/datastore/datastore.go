package datastore

import (
	"time"

	"github.com/usefathom/fathom/pkg/datastore/sqlstore"
	"github.com/usefathom/fathom/pkg/models"
)

var ErrNoResults = sqlstore.ErrNoResults // ???

type Datastore interface {
	// users
	GetUser(int64) (*models.User, error)
	GetUserByEmail(string) (*models.User, error)
	SaveUser(*models.User) error

	// site stats
	GetSiteStats(time.Time) (*models.SiteStats, error)
	InsertSiteStats(*models.SiteStats) error
	UpdateSiteStats(*models.SiteStats) error
	GetTotalSiteViews(time.Time, time.Time) (int, error)
	GetTotalSiteVisitors(time.Time, time.Time) (int, error)
	GetTotalSiteSessions(time.Time, time.Time) (int, error)
	GetAverageSiteDuration(time.Time, time.Time) (float64, error)
	GetAverageSiteBounceRate(time.Time, time.Time) (float64, error)
	GetRealtimeVisitorCount() (int, error)

	// pageviews
	SavePageview(*models.Pageview) error
	UpdatePageview(*models.Pageview) error
	GetMostRecentPageviewBySessionID(string) (*models.Pageview, error)
	GetProcessablePageviews() ([]*models.Pageview, error)
	DeletePageviews([]*models.Pageview) error

	// page stats
	GetPageStats(time.Time, string, string) (*models.PageStats, error)
	InsertPageStats(*models.PageStats) error
	UpdatePageStats(*models.PageStats) error
	GetAggregatedPageStats(time.Time, time.Time, int) ([]*models.PageStats, error)
	GetAggregatedPageStatsPageviews(time.Time, time.Time) (int, error)

	// referrer stats
	GetReferrerStats(time.Time, string) (*models.ReferrerStats, error)
	InsertReferrerStats(*models.ReferrerStats) error
	UpdateReferrerStats(*models.ReferrerStats) error
	GetAggregatedReferrerStats(time.Time, time.Time, int) ([]*models.ReferrerStats, error)
	GetAggregatedReferrerStatsPageviews(time.Time, time.Time) (int, error)

	Close()
}

func New(c *sqlstore.Config) Datastore {
	return sqlstore.New(c)
}
