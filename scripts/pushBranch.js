const fs          = require('fs');
const path        = require('path');
const execSync    = require('child_process').execSync;

const GitHubAgent = require('./github/enhanced_agent');
const VERSION     = require('./../package.json').version;
const OGMA        = require('./../package.json').dependencies.ogma;
const REPO_NAME   = 'builds';
const BUILD_NAME  = '../dist';
const BUILD_DIR   = path.join(__dirname, BUILD_NAME);

function exit(msg, code) {
  if (msg) console.error(msg);
  process.exit(code || 1);
}

function exec(cmd, description) {
  if (description) {
    console.log(description);
  }

  if (typeof cmd === 'function') {
    return cmd();
  } else {
    try {
      var result = execSync(cmd, {encoding: 'utf8'}).trim();
      return result;
    } catch (e) {
      exit(`Command "${cmd}" failed, exiting.`);
    }
  }
}

function format(x) {
  return x < 10 ? `0${x}` : x;
}

function getCurrentDate() {
  let now = new Date();

  let day = `${now.getFullYear()}-${format(now.getMonth() + 1)}-${format(now.getDate())}`;
  let time = `${format(now.getHours())}:${format(now.getMinutes())}:${format(now.getSeconds())}`;

  return `${day}@${time}`;
}

function getLocalBranchName() {
  let envLocalBranch = process.env.BRANCH_NAME;
  if (envLocalBranch) {
    return envLocalBranch.trim();
  } else {
    return exec('git rev-parse --abbrev-ref HEAD');
  }
}

function getLastCommitHash() {
  return exec('git rev-parse HEAD');
}

const localBranch = getLocalBranchName();

const agent = new GitHubAgent(REPO_NAME);
const lastCommit = getLastCommitHash();
const branch = (localBranch.startsWith('master')) ? `shared-${VERSION}` : `shared-${localBranch}`;

const description = `${localBranch} - ${lastCommit.slice(0, 7)} - ${getCurrentDate()}`;

const packageJson = {
  name: '@linkurious/shared',
  description: description,
  version: VERSION,
  author: 'Linkurious',
  peerDependencies: {
    ogma: OGMA
  },
  dependencies: {
    "@types/lodash": "^4.14.121",
    "@types/lodash-es": "^4.17.2",
    "lodash-es": "^4.17.11",
    "lodash": "^4.17.11",
    "rxjs": "^6.3.3",
    "rxjs-compat": "^6.0.0-rc.0",
    "sha1": "1.1.1",
    "valcheck": "1.1.0",
    "ogma": OGMA,
    "nearley": "^2.18.0"
  }
};

const message = `linkurious-shared - ${description}`;
const files = getTree(fs.readdirSync(BUILD_DIR, 'utf8'), BUILD_DIR).concat(
    {
      path: 'package.json',
      content: JSON.stringify(packageJson, null, '  ')
    }
);

agent.setLogsEnabled(true);

agent.pushFiles({ branch, files, message }).catch(err => {
  console.log(err);
  console.log('Exiting with status code 1');
  process.exit(1);
});

/**
 * @param {Array<string>} arr
 * @return {Array<path: string, content: Content>}
 */
function getTree(arr, rootPath, child) {
  return arr.reduce((result, p) => {
    if ( fs.lstatSync(path.join(rootPath, p)).isDirectory() ) {
      return result.concat(
        getTree(
          fs.readdirSync(path.join(rootPath, p), 'utf8'),
          path.join(rootPath, p),
          (!child) ? p : child + '/' + p
        )
      )
    } else {
      return result.concat([{
        path: (child) ? child + '/' + p : p,
        content: fs.readFileSync(path.join(rootPath, p), 'utf8')
      }]);
    }
  }, []);
}
