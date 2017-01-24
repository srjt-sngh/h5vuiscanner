var h5VUIscanner = function () {
    var fs = require('fs');
    var _ = require("lodash");
    var readline = require('readline');
    var basePathList = [
        '/Users/surjits/workspace/h5_client/vsphere-client-modules/h5-plugin/ui',
        '/Users/surjits/workspace/h5_client/vim-clients/platform/js-ui-lib',
        '/Users/surjits/workspace/h5_client/vim-clients/applications/h5/appliance-ui'
        ];

    var excludedDirs = ['node_modules', 'target', 'locales', 'sprite-icons', 'META-INT', 'WEB-INF', 'css', 'img', 'spec'];
    var vuiDirectives = [
        {
            name: 'vui-combo-box',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-datagrid',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-dialog',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-dropdown',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-portlets',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-progress-bar',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-sign-post',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-slider',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-stack-block',
            usage: 0,
            usageFiles: [],
            plugin: {}
        },
        {
            name: 'vui-stack-view',
            usage: 0,
            usageFiles: [],
            plugin: {}
        }
    ]

    function findVuiUsage(file) {
        var fileText = fs.readFileSync(file, "utf8");
        _.forEach(vuiDirectives, function (directive) {
            var instancesFound = (fileText.match(new RegExp(directive.name, "g")) || []);
            if (instancesFound.length > 0) {
                directive.usage = directive.usage + instancesFound.length;
                directive.usageFiles.push(file);
                var plugin = getPluginFromFileName(file);
                if(!directive.plugin[plugin]){
                    directive.plugin[plugin] = { name: plugin, count: instancesFound.length};
                }
                else {
                    directive.plugin[plugin].count += instancesFound.length;
                }
            }
        });
    }
    function hasExcludedPath(path) {
        return _.find(excludedDirs, function (ed) {
            return path.indexOf(ed) >= 0;
        });
    }
    function getDirsWithFullPath(basePath) {
        if (fs.lstatSync(basePath).isDirectory()) {
            var dirs = fs.readdirSync(basePath);
            return dirs.map(function (dir) {
                return basePath + '/' + dir;
            });
        }
        return [];
    }
    function getExtension(file) {
        var indexOfDot = file.indexOf('.');
        if (indexOfDot >= 0) {
            return file.substr(indexOfDot + 1);
        }
        return null;
    }
    function getPluginFromFileName(fileName){
        var instancesFound = (fileName.match(new RegExp("[a-z -]*-ui[- a-z]*","g")) || []);
        if(instancesFound.length > 0){
            return instancesFound[0];
        }
        return '';
    }
    function isHTMLFile(file) {
        var ext = getExtension(file);
        return ext === 'html';
    }
    function printResults() {
        console.log(JSON.stringify(vuiDirectives));
    }
    function load() {
        while (basePathList.length > 0) {
            var basePath = basePathList.shift();
            var dirList = getDirsWithFullPath(basePath);
            var htmlFiles = [];
            while (dirList.length > 0) {
                var dir = dirList.shift();
                var extention = getExtension(dir);
                if (extention === null) {
                    var subDirs = getDirsWithFullPath(dir);
                    subDirs = _.filter(subDirs, function (sd) { return !hasExcludedPath(sd); });
                    dirList = dirList.concat(subDirs);
                }
                else if (isHTMLFile(dir)) {
                    findVuiUsage(dir);
                }
            }
        }
        return vuiDirectives;
    }
    function loadAndPrint() {
        load();
        printResults();
    }
    return {
        load: load,
        loadAndPrint: loadAndPrint
    }
};


module.exports = h5VUIscanner();