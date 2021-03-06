import fs from 'fs';
import { env } from '../../tool';
import { AppConfig } from '../../app';
import { lastBuildTime, uqTsSrcPath, red, saveTsFile, saveSrcTsFileIfNotExists } from './tools';
import { buildUqsFolder } from './uqsFolder';
import { buildTsIndex } from './tsIndex';
import { buildTsCApp } from './tsCApp';
import { buildTsCBase } from './tsCBase';
import { buildTsVMain } from './tsVMain';

export async function build(options: AppConfig) {
	// 只从test 数据库构建uq ts
	env.testing = true;

	if (lastBuildTime > 0) {
		console.log(red, 'quit !');
		return;
	}
	if (!fs.existsSync(uqTsSrcPath)) {
		fs.mkdirSync(uqTsSrcPath);
	}
	//buildTsAppName(options);
	//buildTsAppConfig(options);
	
	let tsIndex = buildTsIndex();
	saveTsFile('index', tsIndex);
	let tsCApp = buildTsCApp();
	saveSrcTsFileIfNotExists('CApp', 'ts', tsCApp);
	let tsCBase = buildTsCBase();
	saveTsFile('CBase', tsCBase);
	let tsVMain = buildTsVMain();
	saveSrcTsFileIfNotExists('VMain', 'tsx', tsVMain);

	saveTsFile('uqs', '');
	fs.unlinkSync(uqTsSrcPath + '/uqs.ts');
	await buildUqsFolder(uqTsSrcPath + '/uqs', options);
};
