package repo

import (
	"os"
	"path/filepath"
)

// Root returns the website/ directory (parent of tools/llmd-site).
func Root() (string, error) {
	if env := os.Getenv("LLMD_SITE_ROOT"); env != "" {
		return filepath.Abs(env)
	}
	wd, err := os.Getwd()
	if err != nil {
		return "", err
	}
	dir := wd
	for {
		if _, err := os.Stat(filepath.Join(dir, "tools", "llmd-site", "go.mod")); err == nil {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			return wd, nil
		}
		dir = parent
	}
}

func DocsDir(root string) string {
	return filepath.Join(root, "docs")
}
