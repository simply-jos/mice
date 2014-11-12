<?php

require 'contrib/jsmin.php';

define('DEFAULT_SCRIPT', 'default.js');
define('DEFAULT_MIME', 'application/javascript');
define('CACHE_DIR', 'jspp/cache/');
define('USE_CACHE', 'no'); // do not use yet
chdir('../');

class JsppException extends Exception {}

class Jspp {
	private $_scriptName;
	private $_require = array();
	private $_cache = array();
	
	public function __construct($script) {
		$this->_scriptName = $script;
		
		
		if (USE_CACHE == 'yes') {
			clearstatcache();
			
			if (!file_exists(CACHE_DIR))
				mkdir(CACHE_DIR);
				
			if (is_dir(CACHE_DIR)) {
				$dir = opendir(CACHE_DIR);
				
				while ($file = readdir($dir)) {
					list($mtime, $filename) = explode('_', $file);
					
					if ($mtime && $filename) $this->_cache[base64_decode($filename)] = array(
						'mtime' => $mtime,
						'filename' => $filename
					);
				}
			}
		}
		
		header('Content-type: ' . DEFAULT_MIME);
	}
	
	public function process() {
		echo $this->_directiveRequire($this->_scriptName);
	}
	
	private function _parse($contents) {
		$macros = array();
		
		if (preg_match_all('@/\*(.*)\*/@msU', $contents, $matches)) {
			foreach ($matches[1] as $macro) {
				if (preg_match_all('/@([^\\s]*)\\s+(.*);/', $macro, $matches2)) {
					$matches2[1] = array_reverse($matches2[1]);
					$matches2[2] = array_reverse($matches2[2]);
					foreach ($matches2[1] as $num=>$macroName) {
						$method = '_directive' . ucfirst(strtolower($macroName));
						if (method_exists($this, $method)) {
							$contents = $this->$method($matches2[2][$num], $contents);
						}
					}
				}
			}
		}
		
		return $contents;
	}
	
	private function _directiveInclude($data, $context = "", $required = false, $used = false) {
		$require = explode(',', $data);
		$result = "";
		
		foreach ($require as $script) {
			$script = trim($script);
			if (!file_exists($script))
				if ($required)
					throw new JsppException('Require: Script does not exists: ' . $script);
				else continue;
				
			if (in_array($script, $this->_require)) {
				// throw new JsppException('Require: Script already required: ' . $script);
				continue;
			}
				
			$this->_require[] = $script;
			
			if (!isset($this->_cache[$script]) || $this->_cache[$script]['mtime'] < filemtime($script)) {
				if (isset($this->_cache[$script]))
					unlink(CACHE_DIR . $this->_cache[$script]['mtime'] . '_' . $this->_cache[$script]['filename']);

				$contents = file_get_contents($script);
				$contents = "\n" . $this->_parse($contents) . "\n" ;
				
				if (USE_CACHE == 'yes') {
					$mtime = filemtime($script);
					$filename = base64_encode($script);
					
					if (!file_put_contents(CACHE_DIR . $mtime . '_' . $filename, $contents))
						throw new JsppException('Require: Unable to save cache');
					
					$this->_cache[$script] = array(
						'mtime' => $mtime,
						'filename' => $filename
					);
				}
			} else {
				$contents = file_get_contents(CACHE_DIR . $this->_cache[$script]['mtime'] . '_' . $this->_cache[$script]['filename']);
			}
			
			$contents = str_replace(
				array('__DATE__', '__FILE__'),
				array(date("D M j G:i:s T Y"), $script),
				$contents
			);
				
			$result .= $contents;
		}
		
		return $used ? ($context . $result) : ($result . $context);
	}
	
	private function _directiveRequire($data, $context = "") {
		return $this->_directiveInclude($data, $context, true);
	}
	
	private function _directiveUse($data, $context = "") {
		return $this->_directiveInclude($data, $context, true, true);
	}
	
	private function _directiveDefine($data, $context = "") {
		if (preg_match('@([^\\s]*)\\s+(.*)@', $data, $matches)) {
			return str_replace($matches[1], $matches[2], $context);
		} else return $context;
	}
	
	private function _directiveMinify($data, $context = "") {
		if (strtolower($data) == 'yes') {
			return JSMin::minify($context);
		} else return $context;
	}
}

if (isset($_GET['script']))
	$script = $_GET['script'];
else
	$script = DEFAULT_SCRIPT;
	
$jspp = new Jspp($script);

try {
	$jspp->process();
} catch (JsppException $e) {
	die('console.log("' . $e->getMessage() . '");');
}
