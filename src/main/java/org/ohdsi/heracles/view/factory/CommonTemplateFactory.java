package org.ohdsi.heracles.view.factory;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

import com.google.common.base.Strings;

@Component
public class CommonTemplateFactory {
	
	private static final String COMMON_TEMPLATE = "templates/common/common_template";
	
	@Value("${application.message}")
	private String message;
	
	@Value("${application.name}")
	private String name;
	
	@Value("${webapi.url}")
	private String webApiUrl;
	
	@Value("${html.lang}")
	private String htmlLang;
	
	@Value("${demo.mode}")
	private boolean demoMode;
	
	
	/**
	 * Creates a common velocity template with the head, body, script and css includes
	 * 
	 * @param innerTemplateName The path to the template. The first directory should be parallel to templates/common
	 * @param pageTitle The title of the page
	 */
	public ModelAndView createMasterView (String innerTemplateName, String pageTitle) {
		// TODO add context/security info?
		
		ModelAndView modelAndView = new ModelAndView(COMMON_TEMPLATE);
		modelAndView.addObject("currentDateTime", new Date());
		modelAndView.addObject("currentDateTimeInMillis", System.currentTimeMillis());
		modelAndView.addObject("appMessage", message);
		modelAndView.addObject("appName", name);
		modelAndView.addObject("webApiUrl", webApiUrl);
		modelAndView.addObject("pageTitle", Strings.isNullOrEmpty(pageTitle) ?
				name : pageTitle);
		modelAndView.addObject("innerTemplate", String.format("templates/%s.vm", innerTemplateName));
		modelAndView.addObject("homePath", "/home/index.html");
		modelAndView.addObject("demoMode", demoMode);
		modelAndView.addObject("htmlLang", htmlLang);
		
		
		return modelAndView;
	}
}
