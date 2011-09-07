require 'rubygems'
require 'middleman'
require 'coderay'  # get one of supported highlighters
require 'rack/codehighlighter'

use Rack::Codehighlighter, :coderay, :element => "pre", :pattern => /\A:::(\w+)\s*\n/


run Middleman.server