const fs = require("fs");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/* GeeksForGeeks */
exports.geeksForGeeks = async () => {
  var Url = "https://auth.geeksforgeeks.org/user/18951a1285/practice";

  got(Url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      dom.window.document.querySelectorAll("span").forEach((item) => {
        a = item.textContent;
        if (a.indexOf("Overall Coding Score:") === 0) {
          a = a.split(":");
          a = a[1].trim();
          a = Number(a);
          return a;
        }
      });
      return NaN;
    })
    .catch((err) => {
      return NaN;
    });
};

/* Hackerrank */

exports.hackerrank1 = async () => {
  var Url =
    "https://www.hackerrank.com/leaderboard?filter=avinashvytla351&filter_on=hacker&page=1&track=algorithms&type=practice";

  got(Url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      a = dom.window.document.querySelectorAll(".score")[1].textContent;
      a = Number(a);
      return a;
    })
    .catch((err) => {
      return NaN;
    });
};

exports.hackerrank2 = async () => {
  var Url =
    "https://www.hackerrank.com/leaderboard?filter=avinashvytla351&filter_on=hacker&page=1&track=data-structures&type=practice";

  got(Url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      a = dom.window.document.querySelectorAll(".score")[1].textContent;
      a = Number(a);
      return a;
    })
    .catch((err) => {
      return NaN;
    });
};

/* CodeChef */
exports.codeChef = async () => {
  var Url = "https://www.codechef.com/users/avinash351";

  got(Url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      a = dom.window.document.querySelectorAll("h5")[0].textContent;
      a = a.split("(");
      a = a[1];
      a = a.split(")");
      a = a[0];
      a = Number(a);
      return a * 10;
    })
    .catch((err) => {
      return NaN;
    });
};

/* Codeforces */
exports.codeForces = async () => {
  var Url = "https://codeforces.com/profile/avinashvytla351";

  got(Url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      a = dom.window.document.querySelectorAll(".user-gray");
      a = a[a.length - 1].textContent;
      a = Number(a);
      return a;
    })
    .catch((err) => {
      return NaN;
    });
};

/* InterviewBit */
exports.interviewBit = async () => {
  var Url = "https://www.interviewbit.com/profile/avinashvytla351";

  got(Url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      a = dom.window.document.querySelectorAll(".txt")[1];
      a = a.textContent;
      a = Number(a);
      return a;
    })
    .catch((err) => {
      return NaN;
    });
};

/* Spoj */
exports.spoj = async () => {
  var Url = "https://www.spoj.com/users/avinash351/";

  got(Url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      a = dom.window.document.querySelectorAll("dd")[0].textContent;
      a = Number(a);
      return a;
    })
    .catch((err) => {
      return NaN;
    });
};

/* LeetCode */

const leetcodeDiscussionPage =
  "https://leetcode.com/problems/reverse-pair/discuss?currentPage=1&orderBy=most_votes";
const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto(leetcodeDiscussionPage);
await page.waitForSelector(".topic-item-wrap__2FSZ");
    const elements = await page.$$(".topic-item-wrap__2FSZ");

    const solutions = await Promise.all(elements.map(async el => {
                const solution = getSolutionDetails(el);
                return solution;
    }));

      
    function getSolutionDetails(element) {
            const title = await el.$eval(
                ".topic-title__3LYM",
                el => el.textContent
            );
            const solutionLink = await el.$eval(
                ".title-link__1ay5",
                el => `${origin}${el.getAttribute("href")}`
            );
           
           return { solutionLink, title };
    }
  async function getSolutionDetails(element) {
            const title = await el.$eval(
                ".topic-title__3LYM",
                el => el.textContent
            );
            const solutionLink = await el.$eval(
                ".title-link__1ay5",
                el => `${origin}${el.getAttribute("href")}`
            );
            
            const solution = getSolution(solutionLink)
           
           return { solutionLink, title, solution };
   }
  
  async function getSolution(link) {
        const page = await browser.getNewPage();
        await page.goto(link);

        await page.waitForSelector(".discuss-markdown-container");

        const markdown = await page.$eval(
            ".discuss-markdown-container",
            el => el.textContent
        );
        await page.close();
        return markdown
   }
