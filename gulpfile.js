const gulp = require('gulp');

function browser(index) {
	const browserSync = require('browser-sync').create();
	browserSync.init({
		// single: true,
		files: ['./amd.html', '../dist/'],
		watchOptions: {
			ignoreInitial: true,
			ignored: ['*.ts', '*.json']
		},
		server: {
			baseDir: './tests/',
			index
		},
		watch: true,
		online: true,
		host: '127.0.0.1',
		open: 'external',
		serveStatic: ['./tests/', './dist/', './node_modules/'],
		port: 8000
	});
}

// Static server
gulp.task('browser-sync-amd', () => {
	browser('amd.html');
});

gulp.task('browser-sync-ie', () => {
	browser('ie.html');
});
