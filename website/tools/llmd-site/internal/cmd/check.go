package cmd

import (
	"fmt"

	"github.com/llm-d/llm-d/website/tools/llmd-site/internal/check"
	"github.com/spf13/cobra"
)

// ExitError carries a process exit code through Cobra.
type ExitError struct {
	Code int
}

func (e ExitError) Error() string {
	return fmt.Sprintf("exit code %d", e.Code)
}

func newCheckCmd() *cobra.Command {
	checkCmd := &cobra.Command{
		Use:   "check",
		Short: "Validation checks on the built site",
	}

	var warnOnly bool

	links := &cobra.Command{
		Use:   "links",
		Short: "Check links in built site",
		Long: `Crawl the built site via docusaurus serve, validate internal and GitHub links,
and write broken-links-report.md. Posts a PR comment when GITHUB_TOKEN and PR context are set.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			code, err := check.CheckLinksWithOptions(rootDir, check.CheckOptions{WarnOnly: warnOnly})
			if err != nil {
				return err
			}
			if code != 0 {
				return ExitError{Code: code}
			}
			return nil
		},
	}

	links.Flags().BoolVar(&warnOnly, "warn-on-broken-links", false, "report broken links but exit 0")

	images := &cobra.Command{
		Use:   "images",
		Short: "Verify images in built site load correctly",
		Long:  `Crawl the built site and verify all img/background/srcset references return HTTP 2xx/3xx.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			code, err := check.CheckImages(rootDir)
			if err != nil {
				return err
			}
			if code != 0 {
				return ExitError{Code: code}
			}
			return nil
		},
	}

	checkCmd.AddCommand(links, images)
	return checkCmd
}
