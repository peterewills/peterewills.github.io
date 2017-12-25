JEKYLLDIR = ~/google-drive/jekyll/pwills.com
HTMLDIR = ~/google-drive/jekyll/pwills.com/_site

update:
	@bundle exec jekyll build
	@cd $(JEKYLLDIR)
	@git add --all
	@git commit -m $(M)
	@git push
	@cd $(HTMLDIR)
	@git add --all
	@git commit -m $(M)
	@git push

