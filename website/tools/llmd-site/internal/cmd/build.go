package cmd

import (
	"fmt"

	"github.com/llm-d/llm-d/website/tools/llmd-site/internal/build"
	"github.com/spf13/cobra"
)

func newBuildCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "build",
		Short: "Build the Docusaurus site",
		Long:  `Run landing:css and npm run build in website/. Output goes to website/build/.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := build.Run(rootDir); err != nil {
				return err
			}
			fmt.Println("✓ build complete")
			return nil
		},
	}
}
