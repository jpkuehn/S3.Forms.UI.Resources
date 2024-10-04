using Umbraco.Cms.Core.Manifest;
using Umbraco.Cms.Core.PropertyEditors;

namespace S3.Forms.UI.Resources.Startup;

///<summary>
/// Notes: In a Razor Class Library, the package.manifest file is not picked up by Umbraco. One of 2 options to deal with this:
/// 1. Create package.manifest programmatically. We're taking this approach below. See:
///     https://docs.umbraco.com/umbraco-cms/v/13.latest-lts/extending/property-editors/package-manifest
///     https://docs.umbraco.com/umbraco-cms/v/13.latest-lts/tutorials/creating-a-property-editor
///     https://dev.to/kevinjump/umbraco-10-razor-class-library-packages-pt1-3nfa
///     
/// 2. Alternate approach to read package.manifest with Stream. See:
///     https://dev.to/kevinjump/umbraco-10-razor-class-library-packages-pt1-3nfa
///     https://github.com/JasonElkin/Umbraco-Together-RCL-Demo-Package/tree/main/src/FontAwesome5Picker/Startup
///     
/// 3. To reference static files stored in the RCL, keep them in the /wwwroot folder and use pathing:
///    a. From within RCL project, use "/_content/S3.UI.Resources/..."
///    b. From website project, use "~/_content/S3.UI.Resources/..."

public class ManifestFilter : IManifestFilter {
    //private const string version = "1.0.0";

    private readonly IDataValueEditorFactory _dataValueEditorFactory;

    public ManifestFilter(IDataValueEditorFactory dataValueEditorFactory) {
        _dataValueEditorFactory = dataValueEditorFactory;
    }

    public void Filter(List<PackageManifest> manifests) {
        string ver = typeof(ManifestFilter).Assembly.GetName().Version.ToString(3);
        //string ver = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? version;

        manifests.Add(new PackageManifest {
            PackageName = "TrackingFields",
            PackageId = "TrackingFields",
            AllowPackageTelemetry = true,
            Scripts = new[] {
                "/_content/S3.Forms.UI.Resources/App_Plugins/FormsExtensions/backoffice/SettingTypes/trackingfields.controller.js"
            },
            Version = ver
        });
    }
}