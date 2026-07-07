package cmd

import (
	"github.com/llm-d/llm-d/website/tools/llmd-site/internal/repo"
	"github.com/spf13/cobra"
)

var rootDir string

func Execute() error {
	return NewRoot().Execute()
}

func NewRoot() *cobra.Command {
	root := &cobra.Command{
		Use:   "llmd-site",
		Short: "Build and validate the llm-d.ai website",
		Long: `Orchestrator for website/ CI: Docusaurus build, link checks, and image verification.`,
		PersistentPreRunE: func(cmd *cobra.Command, args []string) error {
			if rootDir != "" {
				return nil
			}
			r, err := repo.Root()
			if err != nil {
				return err
			}
			rootDir = r
			return nil
		},
	}

	root.PersistentFlags().StringVar(&rootDir, "root", "", "website directory (auto-detected by default)")

	root.AddCommand(newBuildCmd())
	root.AddCommand(newCheckCmd())
	root.AddCommand(newCICmd())

	return root
}
