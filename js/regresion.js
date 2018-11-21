function regresion(data) {
  var coefs; // es un arreglo que contiene los coeficientes del resultado a0, a1,a2
  var Se = 0, St = 0, yAvg = 0;
  var errorStd, Rcuad;
  
  var order = data.length - 1;
  var n = data[0].length;
  
  var A = [];
  for (var i=0; i<=order; i++) {
    A.push([]);
    for (var j=0; j<=order+1; j++)
      A[i].push(0);
  }
       
  var ones = [];
  for (var i=0; i<n; i++) ones.push(1);
  
  var X = Array.from(data);
  var Y = X.pop();
  X.unshift(ones);
  
  for (var i=0; i<= order; i++) {
    for (var j=0; j<=i; j++) {
      var sum = 0;
      for (var l=0; l<n; l++) {
        yAvg += Y[i] / n;
        sum += X[i][l] * X[j][l];
      }
      A[i][j] = sum;
      A[j][i] = sum;
    }
    sum = 0;
    for (var l=0; l<n; l++)
      sum += Y[l]*X[i][l];
    A[i][order+1] = sum;
  }
  
  coefs = gauss(A);
  
  for (var i=0; i<n; i++) {
    Se += Math.pow(Y[i]-sumprod(point(X,i),coefs),2);
    St += Math.pow(Y[i] - yAvg, 2);
  }
  
  return [coefs, Math.sqrt(Se/(n-order-1)), 1-Se/St];
}

function point(X,pos) {
  return X.reduce(function(XatPos,currX){
    XatPos.push(currX[pos]);
    return XatPos;
  },[]);
}

function sumprod(a,b){
  return a.reduce(function(sum,x,i) {
    return sum + x*b[i];
  },0);
}

function gauss(A) {
  var n = A.length;
  var B = [];

  for (var i = 0; i < n; i++) B.push(A[i].pop());

  var X = [];
  for (var i = 0; i < n; i++) X.push(0);

  for (var k = 0; k <= n - 2; k++)
    for (var i = k + 1; i < n; i++) {
      var factor = A[i][k] / A[k][k];
      for (var j = k + 1; j < n; j++) A[i][j] -= factor * A[k][j];
      B[i] -= factor * B[k];
    }

  X[n - 1] = B[n - 1] / A[n - 1][n - 1];

  for (var i = n - 2; i >= 0; i--) {
    var sum = B[i];
    for (var j = i + 1; j < n; j++) sum -= A[i][j] * X[j];
    X[i] = sum / A[i][i];
  }
  return X;
}
