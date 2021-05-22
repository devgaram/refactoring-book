class PerformanceCalculator {
  constructor(aPerformance, play) {
    this.performance = aPerformance;
    this.play = play;
  }

  get amount() {
    throw new Error("서브 클래스에서 처리하자");
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TraedyPerformanceCalculator extends PerformanceCalculator {
  get amount() {
    let result = 0;

    result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }

    return result;
  }
}

class ComedyPerformanceCalculator extends PerformanceCalculator {
  get amount() {
    let result = 0;

    result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;

    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator(aPerformance, play) {
  switch (play.type) {
    case "traedy":
      return new TraedyPerformanceCalculator(aPerformance, play);
    case "comedy":
      return new ComedyPerformanceCalculator(aPerformance, play);
    default:
      throw new Error(`알 수 없는 장르 ${play.type}`);
  }
}

function statement(invoice, plays) {
  return renderPlainText(createStatement(invoice, plays));
}

function renderPlainText(data) {
  let result = `청구 내역 (고객명: ${data.customer})\n`;

  for (let perf of data.performances) {
    // 청구 내역을 출력한다.
    result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
}

function htmlStatement(invoice, plays) {
  return renderHtml(createStatement(invoice, plays));
}

function renderHtml(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += "<table>\n";
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>";
  for (let perf of data.performances) {
    // 청구 내역을 출력한다.
    result += `<tr><td>${perf.play.name}</td><td>${
      perf.audience
    }석</td><td>${usd(perf.amount)}</td></tr>\n`;
  }

  result += "</table>\n";
  result += `<p>총액: ${usd(data.totalAmount)}</p>\n`;
  result += `<p>적립 포인트: ${data.totalVolumeCredits}점</p>\n`;
  return result;
}

function createStatement(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalVolumeCredits = totalVolumeCredits(result);
  result.totalAmount = totalAmount(result);
  return result;

  function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance);
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(result)
    );
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

exports.statement = statement;
exports.htmlStatement = htmlStatement;
