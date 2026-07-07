package build

import (
	"fmt"
	"os"
)

// Run builds the Docusaurus site in website/.
func Run(websiteRoot string) error {
	fmt.Println("=========================================")
	fmt.Println("llm-d.ai Website Build (llmd-site)")
	fmt.Println("=========================================")
	fmt.Println()

	if _, err := os.Stat(websiteRoot); err != nil {
		return fmt.Errorf("website directory not found: %s", websiteRoot)
	}

	fmt.Println("Step 1: Building landing page CSS...")
	if err := runNPM(websiteRoot, nil, "run", "landing:css"); err != nil {
		return err
	}
	fmt.Println("✓ Landing CSS built")
	fmt.Println()

	fmt.Println("Step 2: Building Docusaurus site...")
	if err := runNPM(websiteRoot, nil, "run", "build"); err != nil {
		return err
	}
	fmt.Println("✓ Site built to build/")
	fmt.Println()

	return nil
}
