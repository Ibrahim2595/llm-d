package cmd

import (
	"fmt"

	"github.com/llm-d/llm-d/website/tools/llmd-site/internal/build"
	"github.com/llm-d/llm-d/website/tools/llmd-site/internal/check"
	"github.com/spf13/cobra"
)

func newCICmd() *cobra.Command {
	var skipCheck bool
	var warnOnlyLinks bool

	cmd := &cobra.Command{
		Use:   "ci",
		Short: "Full CI pipeline (build + link check)",
		Long: `Run the same steps as GitHub Actions ci-website-test: build then link check.

Examples:
  llmd-site ci
  llmd-site ci --skip-check`,
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := build.Run(rootDir); err != nil {
				return err
			}

			if skipCheck {
				fmt.Println("✓ ci complete (link check skipped)")
				return nil
			}

			code, err := check.CheckLinksWithOptions(rootDir, check.CheckOptions{WarnOnly: warnOnlyLinks})
			if err != nil {
				return err
			}
			if code != 0 {
				return ExitError{Code: code}
			}

			fmt.Println("✓ ci complete")
			return nil
		},
	}

	cmd.Flags().BoolVar(&skipCheck, "skip-check", false, "build only; skip link check")
	cmd.Flags().BoolVar(&warnOnlyLinks, "warn-on-broken-links", false, "report broken links but exit 0")

	return cmd
}
