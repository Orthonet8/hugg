<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page not found | HU Gibi Gubae</title>
    <style>
        :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
        * { box-sizing: border-box; }
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 1.5rem; color: #172126; background: linear-gradient(135deg, #f8fbfa, #e8f1ef); }
        main { width: min(100%, 34rem); padding: 2.5rem 2rem; text-align: center; background: rgba(255,255,255,.9); border: 1px solid #d6e3df; border-radius: 1.5rem; box-shadow: 0 1.5rem 4rem rgba(20, 62, 57, .12); }
        .mark { width: 4rem; height: 4rem; display: grid; place-items: center; margin: 0 auto 1.25rem; border-radius: 1.25rem; color: #fff; background: #0b5960; font-weight: 800; letter-spacing: .08em; }
        h1 { margin: 0; font-size: clamp(2.5rem, 10vw, 4rem); line-height: 1; color: #0b5960; }
        h2 { margin: 1rem 0 .5rem; font-size: 1.25rem; }
        p { margin: 0 auto 1.5rem; max-width: 28rem; color: #536368; line-height: 1.6; }
        a { display: inline-flex; padding: .75rem 1.25rem; border-radius: .8rem; color: #fff; background: #0b5960; text-decoration: none; font-weight: 700; }
        a:hover { background: #08454a; }
    </style>
</head>
<body>
    <main>
        <div class="mark">HU</div>
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you requested does not exist or may have moved. Return to the HU Gibi Gubae home page to continue.</p>
        <a href="{{ url('/landing') }}">Go to home</a>
    </main>
</body>
</html>
