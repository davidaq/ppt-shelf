package com.davidaq.pptextract;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import javax.imageio.ImageIO;

import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextParagraph;
import org.apache.poi.xslf.usermodel.XSLFTextRun;
import org.apache.poi.xslf.usermodel.XSLFTextShape;

import com.google.gson.Gson;

public class Main {
	public static void main(String[] args) throws IOException {
		if (args.length >= 2) {
			run(args[0], args[1]);
		} else {
			System.out.println("$ <input file> <output dir>");
		}
	}

	public static void run(String file, String targetDirName) throws IOException {
		PPTInfo info = new PPTInfo();
		final File target = new File(targetDirName);
		final File infoFile = new File(target, "info.json");

		if (!target.exists()) {
			target.mkdirs();
		} else if (infoFile.exists()) {
			infoFile.delete();
		}
		info.fileSizeKB = (int) (new File(file).length() / 1024);
		XMLSlideShow ppt = new XMLSlideShow(new FileInputStream(file));
		info.slideCount = ppt.getSlides().size();
		Dimension pgsize = ppt.getPageSize();
		int i = 0;
		ArrayList<String> texts = new ArrayList<String>();
		int sw = 0, sh = 0, sz = 300;
		if (pgsize.getWidth() > sz) {
			sw = sz;
			sh = (int) (sw * pgsize.getHeight() / pgsize.getWidth());
		}
		if (sh > sz) {
			sh = sz;
			sw = (int) (sh * pgsize.getWidth() / pgsize.getHeight());
		}
		for (XSLFSlide slide : ppt.getSlides()) {
			i++;
			System.out.println(i);

			StringBuffer text = new StringBuffer();
			String pre = null;
			XSLFTextShape[] phs = slide.getPlaceholders();
			for (XSLFTextShape ts : phs) {
				java.util.List<XSLFTextParagraph> tpl = ts.getTextParagraphs();
				for (XSLFTextParagraph tp : tpl) {
					java.util.List<XSLFTextRun> trs = tp.getTextRuns();
					for (XSLFTextRun tr : trs) {
						if (pre != null && pre.length() > 1)
							text.append('\n');
						String line = tr.getRawText();
						pre = line;
						text.append(line);
						tr.setFontFamily("ºÚÌå");
					}
				}
			}
			texts.add(text.toString());

			BufferedImage img = new BufferedImage(pgsize.width, pgsize.height, BufferedImage.TYPE_INT_RGB);
			Graphics2D graphics = img.createGraphics();

			graphics.setPaint(Color.white);
			graphics.fill(new Rectangle2D.Float(0, 0, pgsize.width, pgsize.height));
			slide.draw(graphics);
			FileOutputStream out = new FileOutputStream(new File(target, "slide-" + i + ".png"));
			ImageIO.write(img, "png", out);
			out.close();
			graphics.dispose();

			Image scaled = img.getScaledInstance(sw, sh, Image.SCALE_SMOOTH);
			BufferedImage dimg = new BufferedImage(sw, sh, BufferedImage.TYPE_INT_ARGB);
			Graphics2D g2d = dimg.createGraphics();
			g2d.drawImage(scaled, 0, 0, null);
			out = new FileOutputStream(new File(target, "thumb-" + i + ".png"));
			ImageIO.write(dimg, "png", out);
			out.close();
			g2d.dispose();
		}
		ppt.close();
		if (texts.size() > 0) {
			info.title = texts.get(0).trim().split("\n")[0];
		}
		info.text = texts;
		Gson gson = new Gson();

		try {
			ZipEntry bgmEntry = null;
			long size = 0;
			ZipFile zip = new ZipFile(file);
			Enumeration<? extends ZipEntry> iter = zip.entries();
			while (iter.hasMoreElements()) {
				ZipEntry entry = iter.nextElement();
				if (!entry.isDirectory() && entry.getName().startsWith("ppt/media")
						&& entry.getName().endsWith(".mp3")) {
					System.out.println(entry.getName());
					if (entry.getSize() > size) {
						size = entry.getSize();
						bgmEntry = entry;
					}
					break;
				}
			}
			if (bgmEntry != null) {
				InputStream in = zip.getInputStream(bgmEntry);
				OutputStream bgmOutput = new FileOutputStream(new File(target, "bgm.mp3"));
				byte buff[] = new byte[4096];
				int len;
				while (0 < (len = in.read(buff))) {
					bgmOutput.write(buff, 0, len);
				}
				bgmOutput.close();
				info.haveBgm = true;
			}
			zip.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		FileOutputStream infoOutput = new FileOutputStream(infoFile);
		infoOutput.write(gson.toJson(info).getBytes("utf-8"));
		infoOutput.close();
	}
}
