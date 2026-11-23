import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO_OWNER = 'vachan18';
const REPO_NAME = 'Sahayak';

const epicSubIssueMap = {
  1: [2, 3],
  4: [5, 6, 7, 8],
  9: [10, 11, 12],
  13: [14, 15, 16],
  17: [18, 19, 20],
  21: [22, 23, 24],
};

function runGraphQL(query) {
  const tempFile = path.join(process.cwd(), 'scripts', 'temp_query.graphql');
  fs.writeFileSync(tempFile, query, 'utf8');
  try {
    const res = execSync(`gh api graphql -F query=@"${tempFile}"`, { encoding: 'utf8' });
    fs.unlinkSync(tempFile);
    return JSON.parse(res);
  } catch (err) {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    throw err;
  }
}

async function main() {
  console.log('🔍 Fetching node IDs for all issues (1 through 24)...');

  const issueQueries = Array.from({ length: 24 }, (_, i) => {
    const num = i + 1;
    return `issue_${num}: issue(number: ${num}) { id number title }`;
  }).join('\n');

  const fullQuery = `
  query {
    repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
      ${issueQueries}
    }
  }
  `;

  const queryRes = runGraphQL(fullQuery);
  const issues = queryRes.data.repository;

  console.log('✅ Successfully fetched all issue node IDs.');

  for (const [epicNumStr, subIssueNums] of Object.entries(epicSubIssueMap)) {
    const epicNum = parseInt(epicNumStr, 10);
    const epicNode = issues[`issue_${epicNum}`];
    console.log(`\n🔗 Linking sub-issues for Epic #${epicNum} (${epicNode.title}):`);

    for (const subNum of subIssueNums) {
      const subNode = issues[`issue_${subNum}`];
      console.log(`  ↪ Adding Sub-issue #${subNum} (${subNode.title})...`);

      const mutation = `
      mutation {
        addSubIssue(input: {
          issueId: "${epicNode.id}",
          subIssueId: "${subNode.id}"
        }) {
          issue { id number }
          subIssue { id number }
        }
      }
      `;

      try {
        runGraphQL(mutation);
        console.log(`    ✅ Linked #${subNum} to #${epicNum}`);
      } catch (err) {
        console.log(`    ⚠️ Note: ${err.message.split('\n')[0]}`);
      }
    }
  }

  console.log('\n📊 Verifying native sub-issue progress for all 6 Epics:');
  const verifyQueries = Object.keys(epicSubIssueMap).map(epicNum => {
    return `epic_${epicNum}: issue(number: ${epicNum}) {
      number
      title
      subIssuesSummary {
        total
        completed
        percentCompleted
      }
      subIssues(first: 10) {
        nodes {
          number
          title
          state
        }
      }
    }`;
  }).join('\n');

  const verifyRes = runGraphQL(`
  query {
    repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
      ${verifyQueries}
    }
  }
  `);

  console.log('\n=============================================================');
  for (const [key, epic] of Object.entries(verifyRes.data.repository)) {
    const summary = epic.subIssuesSummary;
    console.log(`Epic #${epic.number}: ${epic.title}`);
    console.log(`  📈 Progress: ${summary.completed}/${summary.total} completed (${summary.percentCompleted}%)`);
    for (const sub of epic.subIssues.nodes) {
      console.log(`    - [#${sub.number}] ${sub.title} [${sub.state}]`);
    }
  }
  console.log('=============================================================');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
